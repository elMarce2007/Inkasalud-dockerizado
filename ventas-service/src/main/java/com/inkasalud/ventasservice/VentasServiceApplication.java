package com.inkasalud.ventasservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class VentasServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(VentasServiceApplication.class, args);
    }
}
