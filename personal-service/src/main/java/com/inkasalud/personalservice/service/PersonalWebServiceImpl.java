package com.inkasalud.personalservice.service;

import com.inkasalud.personalservice.dto.PersonalDto;
import com.inkasalud.personalservice.entity.Personal;
import com.inkasalud.personalservice.repository.PersonalRepository;
import jakarta.jws.WebService;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
@WebService(endpointInterface = "com.inkasalud.personalservice.service.IPersonalWebService",
            serviceName        = "PersonalWebService",
            portName           = "PersonalPort",
            targetNamespace    = "http://service.personalservice.inkasalud.com")
public class PersonalWebServiceImpl implements IPersonalWebService {

    private final PersonalRepository personalRepository;

    public PersonalWebServiceImpl(PersonalRepository personalRepository) {
        this.personalRepository = personalRepository;
    }

    @Override
    public String registrarPersonal(String nombres, String apellidos, String cargo, String email) {
        Personal p = new Personal();
        p.setNombres(nombres);
        p.setApellidos(apellidos);
        p.setCargo(cargo);
        p.setEmail(email);

        Personal guardado = personalRepository.save(p);
        return "Personal registrado con ID: " + guardado.getId();
    }

    @Override
    public String actualizarPersonal(Long id, String nombres, String apellidos, String cargo, String email) {
        Optional<Personal> opt = personalRepository.findById(id);
        if (opt.isEmpty()) return "Personal con ID " + id + " no encontrado.";

        Personal p = opt.get();
        p.setNombres(nombres);
        p.setApellidos(apellidos);
        p.setCargo(cargo);
        p.setEmail(email);
        personalRepository.save(p);

        return "Personal actualizado correctamente.";
    }

    @Override
    public String eliminarPersonal(Long id) {
        if (!personalRepository.existsById(id))
            return "Personal con ID " + id + " no encontrado.";

        personalRepository.deleteById(id);
        return "Personal eliminado correctamente.";
    }

    @Override
    public List<PersonalDto> listarPersonal() {
        return personalRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public PersonalDto buscarPersonalPorId(Long id) {
        return personalRepository.findById(id)
                .map(this::toDto)
                .orElse(null);
    }

    @Override
    public List<PersonalDto> buscarPersonalPorCargo(String cargo) {
        return personalRepository.findByCargo(cargo).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private PersonalDto toDto(Personal p) {
        return new PersonalDto(p.getId(), p.getNombres(), p.getApellidos(), p.getCargo(), p.getEmail());
    }
}