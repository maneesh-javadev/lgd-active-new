import socket
import threading
import sys

def forward(src, dst):
    try:
        while True:
            data = src.recv(65536)
            if not data:
                break
            dst.sendall(data)
    except Exception:
        pass
    finally:
        try:
            src.close()
        except Exception:
            pass
        try:
            dst.close()
        except Exception:
            pass

def proxy_listener(local_port, remote_host, remote_port):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('0.0.0.0', local_port))
    server.listen(100)
    print(f"Proxying 0.0.0.0:{local_port} -> {remote_host}:{remote_port}", flush=True)
    while True:
        try:
            client_sock, addr = server.accept()
            remote_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            remote_sock.connect((remote_host, remote_port))
            t1 = threading.Thread(target=forward, args=(client_sock, remote_sock), daemon=True)
            t2 = threading.Thread(target=forward, args=(remote_sock, client_sock), daemon=True)
            t1.start()
            t2.start()
        except Exception as e:
            print(f"Error handling connection on port {local_port}: {e}", flush=True)

if __name__ == '__main__':
    # Determine Windows Host IP from default route
    import subprocess
    res = subprocess.check_output("ip route show default", shell=True).decode()
    host_ip = res.split()[2]
    print(f"Detected Windows Host IP: {host_ip}", flush=True)

    # 5432 -> Windows Host PostgreSQL
    t_pg = threading.Thread(target=proxy_listener, args=(5432, host_ip, 5432), daemon=True)
    t_pg.start()

    # 6379 -> Redis container (127.0.0.1:6379 inside WSL VM)
    t_redis = threading.Thread(target=proxy_listener, args=(6379, '127.0.0.1', 6379), daemon=True)
    t_redis.start()

    t_pg.join()
