package com.inkasalud.personalservice.repository;

import com.inkasalud.personalservice.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PersonalRepository extends JpaRepository<Personal, Long> {
    List<Personal> findByCargo(String cargo);
}
