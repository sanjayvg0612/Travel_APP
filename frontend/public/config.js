// ===================================================================
// WANDERLUST RUNTIME API CONFIGURATION (FOR AWS ALB PATH-BASED ROUTING)
// ===================================================================
//
// In your AWS Application Load Balancer setup:
// - ALB DNS: http[s]://<your-alb-name>.us-east-1.elb.amazonaws.com
// - Listener Rule 1: /api/* -> Backend Target Group (Port 5000)
// - Default Rule:    /*     -> Frontend Target Group (Port 80)
//
// Because the website and the API share the same ALB origin,
// leave window.__API_URL__ as empty ("").
// The frontend uses relative `/api` automatically with zero CORS issues!
//
window.__API_URL__ = "";
