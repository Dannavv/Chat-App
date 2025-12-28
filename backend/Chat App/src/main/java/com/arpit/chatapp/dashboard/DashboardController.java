package com.arpit.chatapp.dashboard;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<?> getDashboard(HttpServletRequest request) {

        try {
            String userId = (String) request.getAttribute("userId");
            System.out.println("📌 DASHBOARD userId = " + userId);

            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("UserId missing in request");
            }

            return ResponseEntity.ok(dashboardService.getDashboard(userId));

        } catch (Exception e) {
            // 🔥 FULL STACK TRACE
            e.printStackTrace();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Dashboard failed: " + e.getMessage());
        }
    }
}
