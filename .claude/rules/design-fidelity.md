# Design fidelity

- The Claude Design prototype is the visual source of truth. Do not redesign, "improve", or swap its palette, spacing, radii, blur or motion.
- Use the prototype's real values via tokens (src/shared/theme). Cite the template line range in each spec's design-reference.md.
- Deviations are allowed only for accessibility, performance (e.g. solid background instead of blur at <=760px) or safety, and must be listed in the spec.
- `design/source/**` is immutable.
