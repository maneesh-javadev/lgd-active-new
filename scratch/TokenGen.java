package scratch;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.List;
import java.util.UUID;

public class TokenGen {
    public static void main(String[] args) {
        String activeSecret = System.getenv("JWT_SECRET");
        if (activeSecret == null || activeSecret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET environment variable is mandatory and not set.");
        }
        String legacySecret = "[REDACTED_COMPROMISED_SECRET]";
        
        Key activeKey = Keys.hmacShaKeyFor(activeSecret.getBytes(StandardCharsets.UTF_8));
        Key legacyKey = Keys.hmacShaKeyFor(legacySecret.getBytes(StandardCharsets.UTF_8));
        
        Date now = new Date();
        Date expiry = new Date(now.getTime() + 3600000);
        
        // 1. EXP-001 Legacy Token
        String legacyToken = Jwts.builder()
                .setId("legacy-jti-" + UUID.randomUUID())
                .setSubject("1")
                .claim("userId", 1L)
                .claim("userType", "Center")
                .claim("roleId", 1L)
                .claim("privileges", List.of("USER_MANAGEMENT", "RESOURCE_PRIVILEGE"))
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(legacyKey, SignatureAlgorithm.HS256)
                .compact();
                
        // 2. EXP-011 Officer Token (Valid authentication, unprivileged)
        String officerToken = Jwts.builder()
                .setId("officer-jti-" + UUID.randomUUID())
                .setSubject("902")
                .claim("userId", 902L)
                .claim("userType", "State")
                .claim("stateCode", 9)
                .claim("districtCode", 0)
                .claim("roleId", 5L)
                .claim("roleTypeCode", "STATE_OFFICER")
                .claim("roleLevelCode", "STATE")
                .claim("privileges", List.of("VIEW_DRAFTS"))
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(activeKey, SignatureAlgorithm.HS256)
                .compact();
                
        // 3. EXP-012 Admin Revocation Token
        String revJti = "rev-test-jti-" + System.currentTimeMillis();
        String revToken = Jwts.builder()
                .setId(revJti)
                .setSubject("101")
                .claim("userId", 101L)
                .claim("userType", "Center")
                .claim("roleId", 1L)
                .claim("privileges", List.of("USER_MANAGEMENT", "RESOURCE_PRIVILEGE"))
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(activeKey, SignatureAlgorithm.HS256)
                .compact();
                
        // 4. EXP-021 Revenue Admin Token
        String revAdminToken = Jwts.builder()
                .setId("rev-admin-" + UUID.randomUUID())
                .setSubject("88")
                .claim("userId", 88L)
                .claim("userType", "Center")
                .claim("roleId", 1L)
                .claim("privileges", List.of("DISTRICT_CREATE", "DISTRICT_PUBLISH"))
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(activeKey, SignatureAlgorithm.HS256)
                .compact();

        System.out.println("LEGACY_TOKEN=" + legacyToken);
        System.out.println("OFFICER_TOKEN=" + officerToken);
        System.out.println("REV_JTI=" + revJti);
        System.out.println("REV_TOKEN=" + revToken);
        System.out.println("REV_ADMIN_TOKEN=" + revAdminToken);
    }
}
