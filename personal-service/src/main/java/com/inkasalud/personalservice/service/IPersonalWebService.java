package com.inkasalud.personalservice.service;

import com.inkasalud.personalservice.dto.PersonalDto;
import jakarta.jws.WebMethod;
import jakarta.jws.WebParam;
import jakarta.jws.WebService;

import java.util.List;

@WebService(name = "IPersonalWebService",
            targetNamespace = "http://service.personalservice.inkasalud.com")
public interface IPersonalWebService {

    @WebMethod(operationName = "registrarPersonal")
    String registrarPersonal(
            @WebParam(name = "nombres")   String nombres,
            @WebParam(name = "apellidos") String apellidos,
            @WebParam(name = "cargo")     String cargo,
            @WebParam(name = "email")     String email
    );

    @WebMethod(operationName = "actualizarPersonal")
    String actualizarPersonal(
            @WebParam(name = "id")        Long id,
            @WebParam(name = "nombres")   String nombres,
            @WebParam(name = "apellidos") String apellidos,
            @WebParam(name = "cargo")     String cargo,
            @WebParam(name = "email")     String email
    );

    @WebMethod(operationName = "eliminarPersonal")
    String eliminarPersonal(
            @WebParam(name = "id") Long id
    );

    @WebMethod(operationName = "listarPersonal")
    List<PersonalDto> listarPersonal();

    @WebMethod(operationName = "buscarPersonalPorId")
    PersonalDto buscarPersonalPorId(
            @WebParam(name = "id") Long id
    );

    @WebMethod(operationName = "buscarPersonalPorCargo")
    List<PersonalDto> buscarPersonalPorCargo(
            @WebParam(name = "cargo") String cargo
    );
}