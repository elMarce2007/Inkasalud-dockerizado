package com.inkasalud.personalservice.config;

import com.inkasalud.personalservice.service.PersonalWebServiceImpl;
import jakarta.xml.ws.Endpoint;
import org.apache.cxf.Bus;
import org.apache.cxf.jaxws.EndpointImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CxfConfig {

    @Bean
    public Endpoint personalEndpoint(Bus bus, PersonalWebServiceImpl service) {
        EndpointImpl endpoint = new EndpointImpl(bus, service);
        endpoint.publish("/personal");
        return endpoint;
    }
}