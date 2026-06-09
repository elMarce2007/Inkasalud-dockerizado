package com.inkasalud.apigateway.config;

import com.inkasalud.apigateway.filter.JwtAuthenticationFilter;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class GatewayConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    public GatewayConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-service", r -> r
                        .path("/api/auth/**")
                        .uri("lb://auth-service"))
                .route("cliente-service", r -> r
                        .path("/api/clientes/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("lb://cliente-service"))
                .route("catalogo-service-categorias", r -> r
                        .path("/api/categorias/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("lb://catalogo-service"))
                .route("catalogo-service-productos", r -> r
                        .path("/api/productos/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("lb://catalogo-service"))
                .route("ventas-service", r -> r
                        .path("/api/ventas/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("lb://ventas-service"))
                .route("personal-service", r -> r
                        .path("/api/personal/**")
                        .filters(f -> f.filter(jwtAuthFilter))
                        .uri("lb://personal-service"))
                .build();
    }

    @Bean
    public CorsWebFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200", "http://127.0.0.1:4200"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsWebFilter(source);
    }
}
