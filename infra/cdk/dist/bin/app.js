#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = __importStar(require("aws-cdk-lib"));
const landing_public_api_stack_1 = require("../lib/landing-public-api-stack");
const app = new cdk.App();
const stage = app.node.tryGetContext('stage') ?? process.env.STAGE ?? 'development';
const allowedOrigins = app.node.tryGetContext('allowedOrigins') ??
    process.env.ALLOWED_ORIGINS ??
    'https://www.bharatcover.net,https://bharatcover.net,http://localhost:4000';
new landing_public_api_stack_1.LandingPublicApiStack(app, `LandingPublicApi-${stage}`, {
    stage,
    allowedOrigins,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION ?? 'ap-south-1',
    },
    description: 'Guest landing funnel API (shared DynamoDB with insurance-platform)',
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vYmluL2FwcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxpREFBbUM7QUFDbkMsOEVBQXdFO0FBRXhFLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLE1BQU0sS0FBSyxHQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBWSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLGFBQWEsQ0FBQztBQUNoRyxNQUFNLGNBQWMsR0FDakIsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsZ0JBQWdCLENBQVk7SUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlO0lBQzNCLDJFQUEyRSxDQUFDO0FBRTlFLElBQUksZ0RBQXFCLENBQUMsR0FBRyxFQUFFLG9CQUFvQixLQUFLLEVBQUUsRUFBRTtJQUMxRCxLQUFLO0lBQ0wsY0FBYztJQUNkLEdBQUcsRUFBRTtRQUNILE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQjtRQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxZQUFZO0tBQ3ZEO0lBQ0QsV0FBVyxFQUFFLG9FQUFvRTtDQUNsRixDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgTGFuZGluZ1B1YmxpY0FwaVN0YWNrIH0gZnJvbSAnLi4vbGliL2xhbmRpbmctcHVibGljLWFwaS1zdGFjayc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5cbmNvbnN0IHN0YWdlID0gKGFwcC5ub2RlLnRyeUdldENvbnRleHQoJ3N0YWdlJykgYXMgc3RyaW5nKSA/PyBwcm9jZXNzLmVudi5TVEFHRSA/PyAnZGV2ZWxvcG1lbnQnO1xuY29uc3QgYWxsb3dlZE9yaWdpbnMgPVxuICAoYXBwLm5vZGUudHJ5R2V0Q29udGV4dCgnYWxsb3dlZE9yaWdpbnMnKSBhcyBzdHJpbmcpID8/XG4gIHByb2Nlc3MuZW52LkFMTE9XRURfT1JJR0lOUyA/P1xuICAnaHR0cHM6Ly93d3cuYmhhcmF0Y292ZXIubmV0LGh0dHBzOi8vYmhhcmF0Y292ZXIubmV0LGh0dHA6Ly9sb2NhbGhvc3Q6NDAwMCc7XG5cbm5ldyBMYW5kaW5nUHVibGljQXBpU3RhY2soYXBwLCBgTGFuZGluZ1B1YmxpY0FwaS0ke3N0YWdlfWAsIHtcbiAgc3RhZ2UsXG4gIGFsbG93ZWRPcmlnaW5zLFxuICBlbnY6IHtcbiAgICBhY2NvdW50OiBwcm9jZXNzLmVudi5DREtfREVGQVVMVF9BQ0NPVU5ULFxuICAgIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OID8/ICdhcC1zb3V0aC0xJyxcbiAgfSxcbiAgZGVzY3JpcHRpb246ICdHdWVzdCBsYW5kaW5nIGZ1bm5lbCBBUEkgKHNoYXJlZCBEeW5hbW9EQiB3aXRoIGluc3VyYW5jZS1wbGF0Zm9ybSknLFxufSk7XG5cbmFwcC5zeW50aCgpO1xuIl19