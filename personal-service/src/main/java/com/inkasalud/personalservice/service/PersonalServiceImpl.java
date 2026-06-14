package com.inkasalud.personalservice.service;

import com.inkasalud.personalservice.dto.PersonalDto;
import com.inkasalud.personalservice.entity.Personal;
import com.inkasalud.personalservice.repository.PersonalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PersonalServiceImpl implements PersonalService {

    private final PersonalRepository personalRepository;

    public PersonalServiceImpl(PersonalRepository personalRepository) {
        this.personalRepository = personalRepository;
    }

    @Override
    public List<PersonalDto> listar() {
        return personalRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public PersonalDto obtener(Long id) {
        return toDto(personalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personal no encontrado: " + id)));
    }

    @Override
    public PersonalDto crear(PersonalDto dto) {
        return toDto(personalRepository.save(toEntity(dto)));
    }

    @Override
    public PersonalDto actualizar(Long id, PersonalDto dto) {
        Personal personal = personalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personal no encontrado: " + id));
        personal.setNombres(dto.nombres());
        personal.setApellidos(dto.apellidos());
        personal.setCargo(dto.cargo());
        personal.setEmail(dto.email());
        return toDto(personalRepository.save(personal));
    }

    @Override
    public void eliminar(Long id) {
        personalRepository.deleteById(id);
    }

    private PersonalDto toDto(Personal p) {
        return new PersonalDto(p.getId(), p.getNombres(), p.getApellidos(), p.getCargo(), p.getEmail());
    }

    private Personal toEntity(PersonalDto dto) {
        Personal p = new Personal();
        p.setNombres(dto.nombres());
        p.setApellidos(dto.apellidos());
        p.setCargo(dto.cargo());
        p.setEmail(dto.email());
        return p;
    }
}
