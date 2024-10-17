package com.hairdresser.my_spring_project.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.hairdresser.my_spring_project.entity.Reservations;
import com.hairdresser.my_spring_project.service.ReservationsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/reservations")
public class ReservationsController {

    private final ReservationsService reservationsService;

    @Autowired
    public ReservationsController(ReservationsService reservationsService) {
        this.reservationsService = reservationsService;
    }

    @GetMapping
    public List<Reservations> getAllReservations() {
        return reservationsService.getAllReservations();
    }

    @PostMapping("/active")
    public List<Reservations> getAllActiveReservations(
            @RequestHeader(value = "Authorization", required = false) String idToken,
            @RequestBody Reservations reservation) throws FirebaseAuthException {

        if (idToken != null) {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken.replace("Bearer ", ""));
            String userId = decodedToken.getUid();
            reservation.setUserId(userId);
        }

        return reservationsService.getAllActiveReservations(reservation.getUserId());
    }

    @PostMapping("/history")
    public List<Reservations> getAllHistoryReservations(
            @RequestHeader(value = "Authorization", required = false) String idToken,
            @RequestBody Reservations reservation) throws FirebaseAuthException {

        if (idToken != null) {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken.replace("Bearer ", ""));
            String userId = decodedToken.getUid();
            reservation.setUserId(userId);
        }

        return reservationsService.getAllHistoryReservations(reservation.getUserId());
    }

    @PutMapping("/cancel/{id}")
    public Reservations cancelReservation(
            @RequestHeader(value = "Authorization", required = false) String idToken,
            @PathVariable Integer id) throws FirebaseAuthException {

        if (idToken != null) {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken.replace("Bearer ", ""));
            String userId = decodedToken.getUid();

            Reservations reservation = reservationsService.getReservationById(id);

            if (!reservation.getUserId().equals(userId)) {
                throw new IllegalArgumentException("User is not authorized to cancel this reservation.");
            }
        }

        return reservationsService.cancelReservation(id);
    }

    @PostMapping("/create")
    public Reservations createReservation(
            @RequestBody Reservations reservation,
            @RequestHeader("Authorization") String idToken) throws FirebaseAuthException {

        if ("0".equals(reservation.getUserId())) {
            reservation.setUserId("0");
        } else {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken.replace("Bearer ", ""));
            String uid = decodedToken.getUid();

            reservation.setUserId(uid);
        }

        return reservationsService.saveReservation(reservation);
    }
}
