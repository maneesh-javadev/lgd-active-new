# ==============================================================================
# LGD 2.0 - Hardened Nginx Perimeter Ingress Reverse Proxy
# Security Standards: NIST SP 800-52r2, OWASP ASVS 4.0
# ==============================================================================
FROM nginx:1.26-alpine

# Remove default configuration
RUN rm -rf /etc/nginx/conf.d/* /etc/nginx/nginx.conf

# Copy hardened nginx configuration
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Create directories for certificates and logs
RUN mkdir -p /etc/ssl/certs /etc/ssl/private /var/log/nginx && \
    chmod 750 /etc/ssl/private

EXPOSE 80 443

HEALTHCHECK --interval=10s --timeout=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/healthz > /dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]

