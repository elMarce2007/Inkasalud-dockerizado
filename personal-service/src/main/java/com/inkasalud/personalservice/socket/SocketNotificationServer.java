package com.inkasalud.personalservice.socket;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;

import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class SocketNotificationServer {

    private static final int PUERTO = 9093;

    private final List<PrintWriter> clientes = new CopyOnWriteArrayList<>();

    @PostConstruct
    public void iniciarServidor() {

        Thread hiloServidor = new Thread(() -> {

            try (ServerSocket serverSocket = new ServerSocket(PUERTO)) {

                System.out.println("Servidor Socket PERSONAL iniciado en puerto " + PUERTO);

                while (true) {

                    Socket socketCliente = serverSocket.accept();

                    Thread hiloCliente = new Thread(() -> atenderCliente(socketCliente));

                    hiloCliente.start();
                }

            } catch (Exception e) {

                System.out.println("Error Socket PERSONAL: " + e.getMessage());
            }

        });

        hiloServidor.start();
    }

    private void atenderCliente(Socket socketCliente) {

        try {

            PrintWriter salida =
                    new PrintWriter(socketCliente.getOutputStream(), true);

            clientes.add(salida);

            salida.println("Cliente conectado al socket PERSONAL");

            while (!socketCliente.isClosed()) {
                Thread.sleep(1000);
            }

        } catch (Exception e) {

            System.out.println("Cliente socket PERSONAL desconectado");
        }
    }

    public void notificar(String mensaje) {

        System.out.println("ENVIANDO SOCKET: " + mensaje);

        for (PrintWriter cliente : clientes) {

            cliente.println(mensaje);
        }
    }
}