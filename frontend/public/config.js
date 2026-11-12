// ===================================================================
// WANDERLUST RUNTIME API CONFIGURATION (FOR AWS ALB PATH-BASED ROUTING)
// ===================================================================
//
// Your AWS Application Load Balancer (ap-southeast-2):
// - ALB DNS: http://TRAVEL-ALB-198965046.ap-southeast-2.elb.amazonaws.com
// - Listener Rule 1: /api/* -> Backend Target Group (Port 5000)
// - Default Rule:    /*     -> Frontend Target Group (Port 80)
//
// Because the website and the API share this single ALB DNS origin,
// leave window.__API_URL__ as empty ("").
// The frontend uses relative `/api` automatically with zero CORS issues!
//
window.__API_URL__ = "";
