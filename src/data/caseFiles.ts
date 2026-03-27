/**
 * @file Case file data for the portfolio corkboard
 * Defines all portfolio items, their positions, connections, and media
 *
 * Structure:
 * - CENTER: About/profile card
 * - LEFT: Design, Video, Photography skills
 * - RIGHT: Illustration, Clues, Quote
 *
 * Each card has:
 * - Position: normalized coordinates (0-1)
 * - Type: visual styling
 * - Content: title, subtitle, details
 * - Connections: links to related cards via strings
 */

import type { CaseFile } from "../types";

// Media imports
import howling from "../assets/poster/Howling-Direwolves.jpg";
import burger from "../assets/poster/burger-advertisement.png";
import gnx from "../assets/poster/gnx.jpg";
import hevabi from "../assets/poster/hev-abi.jpg";
import zild from "../assets/poster/zild.png";

// Video URLs are loaded from environment variables (CDN)
// to avoid storing large files in the repository
import { VIDEO_URLS } from "../utils/videoUrls";

/**
 * Portfolio case files array
 * Organized spatially on the corkboard from center outward
 *
 * Position convention:
 * - x: 0 = left edge, 1 = right edge
 * - y: 0 = top edge, 1 = bottom edge
 */
const caseFiles: CaseFile[] = [
  // ═══════════════════════════════════════════════════════════════
  // CENTER: The Nocturnal Artist Profile
  // ═══════════════════════════════════════════════════════════════
  {
    id: "about",
    x: 0.5,
    y: 0.45,
    rotation: 0,
    type: "silhouette",
    title: '"He is known as Joml"',
    subtitle: "Joml Creator",
    contentLabel: "Education",
    content:
      "Bulacan State University - Sarmiento Campus \nBachelor of Science in Information Technology\n(2022 - 2026)\n\nSapang Palay National High School – Senior High School\nScience, Technology, Engineering, and Mathematics\n(2020 - 2022)",
    details: [
      "Alias: The Nocturnal Artist",
      "Status: Actively Creating",
      "Last Seen: Behind a glowing screen at 3 AM",
      "Specialties: Design, Video, Photography",
    ],
    detailsLabel: "Evidence Log",
    connections: ["design", "clue-where"],
    pinOffset: { x: 5, y: -2 },
  },

  // ═══════════════════════════════════════════════════════════════
  // LEFT COLUMN: Creative Skills
  // ═══════════════════════════════════════════════════════════════

  // TOP-LEFT: Graphic Design (Grey torn paper)
  {
    id: "design",
    x: 0.32,
    y: 0.27,
    rotation: -10,
    type: "torn-paper-grey",
    title: "Graphic Design",
    subtitle: "Poster & Visual Art",
    contentLabel: "Case Summary",
    content:
      "A comprehensive collection of digital posters and graphic design compositions. Showcasing expertise in typography, blending modes, visual hierarchy, and color theory. Each piece demonstrates careful attention to composition and aesthetic balance.",
    details: [
      "Tools: Photoshop, Illustrator",
      "Focus: Composition & Color Theory",
      "Style: Modern & Conceptual",
      "Techniques: Layering, Blending, Typography",
    ],
    detailsLabel: "Evidence Log",
    isDraggable: true,
    connections: ["video"],
    pinOffset: { x: -4, y: 10 },
    media: [
      { type: "image", url: howling, caption: "Howling Direwolves" },
      { type: "image", url: burger, caption: "Burger Advertisement" },
      { type: "image", url: gnx, caption: "GNX" },
      { type: "image", url: hevabi, caption: "Hev Abi" },
      { type: "image", url: zild, caption: "Zild" },
    ],
  },

  // MIDDLE-LEFT: Videography (Taped polaroid)
  {
    id: "video",
    x: 0.28,
    y: 0.5,
    rotation: -3,
    type: "taped-polaroid",
    title: "Video\nGraphy",
    subtitle: "Editing & Motion",
    contentLabel: "Case Summary",
    content:
      "Dynamic flow edits and cinematic sequences demonstrating mastery of pacing and visual rhythm. Each project showcases careful editing, smooth transitions, and compelling storytelling through video.",
    details: [
      "Tools: Premiere Pro, After Effects",
      "Focus: Flow, Transitions & Storytelling",
      "Style: Cinematic & Energetic",
      "Techniques: Color Grading, Motion Graphics",
    ],
    detailsLabel: "Evidence Log",
    connections: [],
    pinOffset: { x: 10, y: -4 },
    media: [
      {
        type: "video",
        url: VIDEO_URLS.schoolCinematic,
        caption: "School Cinematic",
      },
      { type: "video", url: VIDEO_URLS.plantaria, caption: "Plantaria" },
      { type: "video", url: VIDEO_URLS.sonavi ?? undefined, caption: "Sonavi" },
      {
        type: "video",
        url: VIDEO_URLS.maryJosette ?? undefined,
        caption: "Mary Josette Academy",
      },
      { type: "video", url: VIDEO_URLS.cinematic, caption: "Cinematic" },
    ],
  },

  // BOTTOM-LEFT: Photography (Torn brown paper)
  {
    id: "photo",
    x: 0.31,
    y: 0.76,
    rotation: 6,
    type: "torn-paper-brown",
    title: "Photo\nGraphy",
    subtitle: "Visual Documentation",
    contentLabel: "Case Summary",
    content:
      "Photographic work capturing moments and subjects with artistic vision. A collection of carefully composed images demonstrating lighting, composition, and subject matter expertise.",
    details: [
      "Focus: Composition & Lighting",
      "Style: Artistic & Documentary",
      "Subjects: Diverse & Compelling",
    ],
    detailsLabel: "Evidence Log",
    connections: ["about"],
    pinOffset: { x: -5, y: 8 },
  },

  // ═══════════════════════════════════════════════════════════════
  // RIGHT COLUMN: Additional Work & Interactive Elements
  // ═══════════════════════════════════════════════════════════════

  // MIDDLE-RIGHT: Illustration
  {
    id: "illustration",
    x: 0.7,
    y: 0.5,
    rotation: -10,
    type: "torn-paper-brown",
    title: "Web Design",
    subtitle: "Digital & Hand-drawn",
    contentLabel: "Case Summary",
    content:
      "Original illustration work showcasing artistic skill and creative vision. A collection of diverse styles and subjects demonstrating versatility in digital and traditional illustration techniques.",
    details: [
      "Mediums: Digital, Traditional",
      "Style: Varied & Experimental",
      "Subjects: Character Design, Conceptual",
    ],
    detailsLabel: "Evidence Log",
    connections: ["about"],
    pinOffset: { x: 2, y: 10 },
  },

  // TOP-RIGHT: Interactive Clue - Where was he last seen?
  {
    id: "clue-where",
    x: 0.67,
    y: 0.3,
    rotation: 10,
    type: "clue-circle",
    title: "Technical\nStack",
    subtitle: "Case Investigation",
    contentLabel: "Case Summary",
    content:
      "Follow the trails. Connect the dots. Discover where the Nocturnal Artist has left their mark across the digital landscape.",
    details: [
      "Last Location: Digital Studio",
      "Status: Creating",
      "Next Clue: Check the evidence",
    ],
    detailsLabel: "Investigation Log",
    connections: [],
    isDraggable: false,
    pinOffset: { x: 0, y: 5 },
  },

  // BOTTOM-RIGHT: Call to Action - Find out about him!
  {
    id: "clue-find",
    x: 0.7,
    y: 0.75,
    rotation: 8,
    type: "torn-paper-brown",
    title: "find\nout\nabout\nhim!",
    subtitle: "Investigate Further",
    contentLabel: "About Me",
    content:
      "Click through the case files to discover more about The Nocturnal Artist. Each file contains evidence of creative mastery and artistic passion.",
    details: [
      "Case Status: Active Investigation",
      "Evidence: Portfolio pieces available",
      "Contact: Available for collaboration",
    ],
    detailsLabel: "Evidence Log",
    connections: ["illustration"],
    isDraggable: false,
    pinOffset: { x: 3, y: 12 },
  },

  // BOTTOM-CENTER: Inspirational Quote / Case Summary
  {
    id: "clue-said",
    x: 0.51,
    y: 0.78,
    rotation: -3,
    type: "cork-text",
    title: "",
    subtitle: "",
    contentLabel: "Case Summary",
    content:
      '+63 950 501 5009\nmislos.jomel@gmail.com\n\n"I will be an\nimportant part of\nthe world\'s progress."',
    details: [],
    detailsLabel: "Evidence Log",
    connections: [],
    isDraggable: false,
    pinOffset: { x: 0, y: 2 },
  },
];

export default caseFiles;
