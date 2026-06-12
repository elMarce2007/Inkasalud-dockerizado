package com.inkasalud.personalservice.soap;

import com.inkasalud.personalservice.entity.Personal;
import com.inkasalud.personalservice.repository.PersonalRepository;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilderFactory;
import java.util.List;
import java.util.Optional;

@Endpoint
public class PersonalWebService {

    private static final String NS = "http://inkasalud.com/personal";

    private final PersonalRepository personalRepository;

    public PersonalWebService(PersonalRepository personalRepository) {
        this.personalRepository = personalRepository;
    }


    @PayloadRoot(namespace = NS, localPart = "listarPersonalRequest")
    @ResponsePayload
    public Element listarPersonal(@RequestPayload Element request) throws Exception {
        List<Personal> lista = personalRepository.findAll();
        Document doc = DocumentBuilderFactory.newInstance()
                .newDocumentBuilder().newDocument();

        Element response = doc.createElementNS(NS, "listarPersonalResponse");
        doc.appendChild(response);

        for (Personal p : lista) {
            Element item = doc.createElementNS(NS, "personal");
            agregarHijo(doc, item, "id",        String.valueOf(p.getId()));
            agregarHijo(doc, item, "nombres",   p.getNombres());
            agregarHijo(doc, item, "apellidos", p.getApellidos());
            agregarHijo(doc, item, "cargo",     p.getCargo());
            agregarHijo(doc, item, "email",     p.getEmail());
            response.appendChild(item);
        }
        return response;
    }


    @PayloadRoot(namespace = NS, localPart = "obtenerPersonalRequest")
    @ResponsePayload
    public Element obtenerPersonal(@RequestPayload Element request) throws Exception {
        long id = Long.parseLong(
                request.getElementsByTagNameNS(NS, "id").item(0).getTextContent());

        Document doc = DocumentBuilderFactory.newInstance()
                .newDocumentBuilder().newDocument();
        Element response = doc.createElementNS(NS, "obtenerPersonalResponse");
        doc.appendChild(response);

        Optional<Personal> opt = personalRepository.findById(id);
        if (opt.isPresent()) {
            Personal p = opt.get();
            Element item = doc.createElementNS(NS, "personal");
            agregarHijo(doc, item, "id",        String.valueOf(p.getId()));
            agregarHijo(doc, item, "nombres",   p.getNombres());
            agregarHijo(doc, item, "apellidos", p.getApellidos());
            agregarHijo(doc, item, "cargo",     p.getCargo());
            agregarHijo(doc, item, "email",     p.getEmail());
            response.appendChild(item);
        }
        return response;
    }


    private void agregarHijo(Document doc, Element padre, String nombre, String valor) {
        Element hijo = doc.createElementNS(NS, nombre);
        hijo.setTextContent(valor != null ? valor : "");
        padre.appendChild(hijo);
    }
}
