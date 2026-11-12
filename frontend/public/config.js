// ===================================================================
// WANDERLUST RUNTIME API CONFIGURATION (FOR MULTI-SERVER DEPLOYMENTS)
// ===================================================================
//
// 1. If Frontend & Backend are on the SAME server or behind an AWS ALB:
//    Leave this as an empty string (""). The app automatically uses the browser URL!
//
// 2. If Frontend & Backend are on TWO SEPARATE SERVERS:
//    Enter your Backend server's Public IP or DNS address below:
//    Example: window.__API_URL__ = "http://54.210.88.99:5000/api";
//
window.__API_URL__ = "";

