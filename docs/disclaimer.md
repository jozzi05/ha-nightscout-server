# Disclaimer — read before using this integration

This document describes limitations of the **Nightscout Home Assistant integration** (the software in this repository). By installing or using it, you acknowledge the following.

## This is not a health app or medical software

- This project is **not** a medical device, **not** a regulated health application, and **not** intended for use in the diagnosis or treatment of any disease or medical condition.
- It is **not** cleared or approved by the FDA, EMA, or any similar authority as a medical product.
- It is **not** a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or diabetes management.
- Glucose values shown in Home Assistant are **for informational and home-automation purposes only** (for example dashboards, lights, or notifications you choose to configure). They are **not** presented as a reliable basis for insulin dosing, carbohydrate decisions, or emergency decisions.

## No warranty; software can fail

The software is provided **“as is”**, without warranty of any kind, express or implied, including but not limited to fitness for a particular purpose, accuracy, availability, or uninterrupted operation.

Glucose and pump-related data depend on Nightscout, your network, Home Assistant, hardware, and third-party systems. **Data may be wrong, delayed, missing, or stale.** Bugs, updates, power loss, Wi‑Fi issues, or misconfiguration can cause incorrect display or automations that do not run when expected.

## Limitation of liability (author and contributors)

To the maximum extent permitted by applicable law:

- The **author(s)**, **maintainers**, and **contributors** of this repository **assume no responsibility or liability** for any use or misuse of this software.
- **You use this integration entirely at your own risk.**
- **No one responsible for this project** is liable for any **direct, indirect, incidental, special, consequential, or exemplary damages**, including but not limited to:
  - Personal injury, hospitalization, or death  
  - Hypoglycemia, hyperglymia, diabetic ketoacidosis (DKA), or any other medical outcome  
  - Incorrect insulin or medication decisions made in reliance on data or automations from this integration  
  - Property damage, data loss, or loss of profit  

This applies even if the author or contributors have been advised of the possibility of such damages.

If you do not agree with these terms, **do not install or use** this integration.

## Automations and dashboards are not safety systems

Automations (lights, sounds, notifications, scripts) that you build in Home Assistant using entities from this integration are **convenience features only**. They:

- Are **not** a replacement for your CGM alerts, pump alarms, finger-stick measurements, or clinician-directed treatment plans.
- May fail silently, trigger late, fire incorrectly, or never fire.
- Should **never** be your only warning for dangerous glucose levels.

Caregivers using Home Assistant for someone else remain fully responsible for following their care team’s guidance and appropriate monitoring tools.

## Privacy

Nightscout and Home Assistant may process sensitive health-related data. You are responsible for securing your instances (HTTPS, API secrets, network access, backups, and who can access your dashboards).

## Summary

**This integration is home-automation glue between Nightscout and Home Assistant. It is not medical software. The author does not accept responsibility for incorrect use, reliance on displayed values, or automation failures.**

If you need urgent medical attention, contact emergency services or your clinician — do not rely on this software.
