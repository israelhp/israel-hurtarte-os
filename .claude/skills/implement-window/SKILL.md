---
name: implement-window
description: "Implement one desktop window (app) using the shared window system."
argument-hint: <app id>
---

# Implement window

Use the shared Window component and window-manager store; never duplicate title bar/traffic-light logic. Content = the app's feature module. Verify: opens from Dock and shortcuts, focus and z-order, minimize/restore, maximize, close, drag clamped to viewport, keyboard (Esc), ES/EN, light/dark, content actually works. Follow /implement-feature for the rest.
