
// Embedded Anatomical Reference Assets (SVG)
// These ensure the application works offline and without external file dependencies.

const MALE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <defs>
    <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f8f9fa;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#e9ecef;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="#ffffff"/>
  
  <!-- Head Contour (Square/Masculine) -->
  <path d="M200 40 C130 40 90 100 90 200 L90 280 C90 380 130 460 200 460 C270 460 310 380 310 280 L310 200 C310 100 270 40 200 40 Z" fill="url(#skin)" stroke="#cbd5e1" stroke-width="2"/>
  
  <!-- Ears -->
  <path d="M80 200 L90 190 L90 250 L80 240 Z" fill="#e2e8f0" stroke="#cbd5e1"/>
  <path d="M320 200 L310 190 L310 250 L320 240 Z" fill="#e2e8f0" stroke="#cbd5e1"/>
  
  <!-- Guide Lines (Subtle) -->
  <line x1="200" y1="40" x2="200" y2="460" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4 4"/>
  <line x1="90" y1="215" x2="310" y2="215" stroke="#e2e8f0" stroke-width="1" stroke-dasharray="4 4"/>

  <!-- Eyes -->
  <path d="M130 215 Q155 205 180 215" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <path d="M220 215 Q245 205 270 215" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="155" cy="220" r="3" fill="#64748b"/>
  <circle cx="245" cy="220" r="3" fill="#64748b"/>
  
  <!-- Brows (Flatter) -->
  <path d="M125 195 Q155 190 185 195" fill="none" stroke="#64748b" stroke-width="3" opacity="0.3"/>
  <path d="M215 195 Q245 190 275 195" fill="none" stroke="#64748b" stroke-width="3" opacity="0.3"/>
  
  <!-- Nose -->
  <path d="M200 215 L192 295 L208 295 Z" fill="#e2e8f0" opacity="0.4"/>
  
  <!-- Mouth -->
  <path d="M160 360 Q200 370 240 360" fill="none" stroke="#94a3b8" stroke-width="2"/>
  
  <!-- Chin Indicator -->
  <path d="M190 440 Q200 445 210 440" fill="none" stroke="#cbd5e1" stroke-width="2"/>
</svg>
`;

const FEMALE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">
  <defs>
    <linearGradient id="skinF" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#fff5f7;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ffe4e6;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="#ffffff"/>
  
  <!-- Head Contour (Oval/Feminine) -->
  <ellipse cx="200" cy="250" rx="110" ry="150" fill="url(#skinF)" stroke="#e5e7eb" stroke-width="2"/>
  
  <!-- Ears -->
  <path d="M85 240 L92 230 L92 280 L85 270 Z" fill="#f3f4f6" stroke="#e5e7eb"/>
  <path d="M315 240 L308 230 L308 280 L315 270 Z" fill="#f3f4f6" stroke="#e5e7eb"/>

  <!-- Guide Lines (Subtle) -->
  <line x1="200" y1="100" x2="200" y2="400" stroke="#fce7f3" stroke-width="1" stroke-dasharray="4 4"/>
  
  <!-- Eyes -->
  <path d="M135 240 Q160 230 185 240" fill="none" stroke="#9ca3af" stroke-width="2"/>
  <path d="M215 240 Q240 230 265 240" fill="none" stroke="#9ca3af" stroke-width="2"/>
  <circle cx="160" cy="245" r="3" fill="#6b7280"/>
  <circle cx="240" cy="245" r="3" fill="#6b7280"/>
  
  <!-- Brows (Arched) -->
  <path d="M130 220 Q160 200 190 220" fill="none" stroke="#9ca3af" stroke-width="2" opacity="0.4"/>
  <path d="M210 220 Q240 200 270 220" fill="none" stroke="#9ca3af" stroke-width="2" opacity="0.4"/>
  
  <!-- Nose -->
  <path d="M200 240 L195 305 L205 305 Z" fill="#f3f4f6" opacity="0.3"/>
  
  <!-- Mouth -->
  <path d="M170 360 Q200 370 230 360" fill="none" stroke="#fca5a5" stroke-width="2"/>
</svg>
`;

export const MALE_FACE_URI = `data:image/svg+xml;utf8,${encodeURIComponent(MALE_SVG)}`;
export const FEMALE_FACE_URI = `data:image/svg+xml;utf8,${encodeURIComponent(FEMALE_SVG)}`;
