package com.inkasalud.clienteservice.service;

import com.inkasalud.clienteservice.dto.ClienteDto;
import com.inkasalud.clienteservice.entity.Cliente;
import com.inkasalud.clienteservice.repository.ClienteRepository;
import org.springframework.stereotype.Service;
import com.inkasalud.clienteservice.socket.SocketNotificationServer;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClienteServiceImpl implements ClienteService {

    private final ClienteRepository clienteRepository;
    private final SocketNotificationServer socketNotificationServer;

    public ClienteServiceImpl(
            ClienteRepository clienteRepository,
            SocketNotificationServer socketNotificationServer
    ) {
        this.clienteRepository = clienteRepository;
        this.socketNotificationServer = socketNotificationServer;
    }

    @Override
    public List<ClienteDto> listar() {
        return clienteRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public ClienteDto obtener(Long id) {
        return toDto(clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + id)));
    }

    @Override
    public ClienteDto crear(ClienteDto dto) {

        Cliente clienteGuardado =
                clienteRepository.save(toEntity(dto));

        socketNotificationServer.notificar(
                "Nuevo cliente registrado: "
                        + clienteGuardado.getNombres()
        );

        return toDto(clienteGuardado);
    }

    @Override
    public ClienteDto actualizar(Long id, ClienteDto dto) {
        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado: " + id));
        cliente.setNombres(dto.nombres());
        cliente.setApellidos(dto.apellidos());
        cliente.setDni(dto.dni());
        cliente.setTelefono(dto.telefono());
        cliente.setEmail(dto.email());
        Cliente clienteActualizado =
                clienteRepository.save(cliente);

        socketNotificationServer.notificar(
                "Cliente actualizado: "
                        + clienteActualizado.getNombres()
        );

        return toDto(clienteActualizado);
    }

    @Override
    public void eliminar(Long id) {

        socketNotificationServer.notificar(
                "Cliente eliminado con ID: " + id
        );

        clienteRepository.deleteById(id);
    }

    private ClienteDto toDto(Cliente c) {
        return new ClienteDto(c.getId(), c.getNombres(), c.getApellidos(), c.getDni(), c.getTelefono(), c.getEmail());
    }

    private Cliente toEntity(ClienteDto dto) {
        Cliente c = new Cliente();
        c.setNombres(dto.nombres());
        c.setApellidos(dto.apellidos());
        c.setDni(dto.dni());
        c.setTelefono(dto.telefono());
        c.setEmail(dto.email());
        return c;
    }
}
