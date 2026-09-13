import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ZenFit API",
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// AI Coach Chat endpoint
app.post("/api/coach/chat", async (req, res) => {
  try {
    const { message, history = [], userProfile = {} } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Intelligent fallback when API key is not configured
      const fallbackResponse = generateSmartFallback(message, userProfile);
      return res.json({
        reply: fallbackResponse,
        source: "fallback",
      });
    }

    const systemInstruction = `You are "ZenBot", the world-class AI Fitness & Wellness Coach for the ZenFit platform.
You combine deep expertise in Ashtanga/Vinyasa yoga, functional strength, HIIT conditioning, breathwork (pranayama), mobility, muscle recovery, and mindful nutrition.
Your tone is warm, motivating, scientific yet accessible, calm, and empowering.

User Context:
- Name: ${userProfile.name || "ZenFit Member"}
- Primary Goal: ${userProfile.goal || "Balanced Wellness & Strength"}
- Experience Level: ${userProfile.experienceLevel || "Intermediate"}
- Preferred Activities: ${userProfile.preferredTypes?.join(", ") || "Yoga, HIIT, Strength"}
- Available Time: ${userProfile.availableTime || "30 minutes"}
- Target Weekly Workouts: ${userProfile.weeklyGoal || "4 sessions"}

Instructions:
1. Answer the member's question with direct, actionable, practical advice.
2. If asking about a yoga pose or exercise, provide key alignment cues, common mistakes to avoid, and safe modifications/progressions.
3. If asking for a workout or session recommendation, tailor it directly to their goals and duration.
4. Keep paragraphs readable with bullet points where appropriate. Keep it concise, energizing, and grounded in holistic wellness.`;

    // Construct prompt with recent history
    let fullPrompt = `System: ${systemInstruction}\n\n`;
    if (Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-6);
      for (const h of recent) {
        fullPrompt += `${h.role === "user" ? "Member" : "Coach"}: ${h.content}\n`;
      }
    }
    fullPrompt += `Member: ${message}\nCoach:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: fullPrompt,
    });

    const reply = response.text || "I'm here to support your fitness journey. How else can I assist you today?";
    return res.json({ reply, source: "gemini" });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    // Return friendly advice even if upstream temporarily fails
    const message = req.body.message || "";
    const userProfile = req.body.userProfile || {};
    const fallbackResponse = generateSmartFallback(message, userProfile);
    return res.json({
      reply: fallbackResponse,
      source: "fallback_recovery",
      details: error.message,
    });
  }
});

// AI Coach Generate Plan endpoint
app.post("/api/coach/generate-plan", async (req, res) => {
  try {
    const { goal, experienceLevel, preferredTypes, availableTime, weeklySchedule, equipment } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        plan: generateDefaultPlan(goal, experienceLevel, availableTime),
        source: "local",
      });
    }

    const prompt = `Create a 7-day personalized wellness and fitness training plan for a member with:
- Fitness Goal: ${goal || "Overall Fitness & Flexibility"}
- Experience Level: ${experienceLevel || "Intermediate"}
- Preferred Types: ${(preferredTypes || []).join(", ") || "Yoga and Strength"}
- Available Workout Time: ${availableTime || "30"} minutes
- Frequency: ${(weeklySchedule || []).length || 4} days per week
- Equipment: ${(equipment || []).join(", ") || "Mat and Dumbbells"}

Return ONLY a valid JSON object matching this schema:
{
  "planTitle": "string",
  "summary": "string",
  "weeklyFocus": "string",
  "days": [
    {
      "dayName": "Monday",
      "workoutTitle": "string",
      "category": "Yoga" | "Strength" | "Cardio" | "Mobility" | "Rest",
      "duration": number,
      "calories": number,
      "intensity": "Gentle" | "Moderate" | "Challenging",
      "description": "string",
      "exercises": ["string", "string", "string"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({ plan: parsed, source: "gemini" });
  } catch (err) {
    console.error("Generate plan error:", err);
    return res.json({
      plan: generateDefaultPlan(req.body.goal, req.body.experienceLevel, req.body.availableTime),
      source: "local_fallback",
    });
  }
});

function generateSmartFallback(message: string, profile: any): string {
  const query = message.toLowerCase();
  const name = profile.name || "friend";

  if (query.includes("sore") || query.includes("recovery") || query.includes("rest")) {
    return `Hello ${name}! Recovery is where your true strength and cellular adaptation happen. 🌿

Here is a recommended 3-step restorative protocol:
1. **Gentle Dynamic Release**: Spend 10-15 minutes on Yin Yoga postures like Child's Pose (Balasana), Reclined Pigeon, and Legs-Up-The-Wall (Viparita Karani) to drain lactic build-up.
2. **Targeted Hydration & Electrolytes**: Drink 500ml of water with a pinch of Himalayan salt or magnesium to alleviate muscular twitching and tightness.
3. **Contrast Shower or Heat**: 10 minutes with a warm heating pad or warm bath to vasodilate capillaries and flush metabolic byproducts.

Would you like me to queue up our 15-minute "Full-Body Restorative Release" session?`;
  }

  if (query.includes("yoga") || query.includes("pose") || query.includes("flexib")) {
    return `Namaste ${name}! Developing graceful flexibility requires steady breathwork alongside alignment:

- **Breathe into the Stretch**: Never force a pose. Breathe smoothly into the stretch using deep diaphragmatic breaths (inhale 4s, exhale 6s).
- **Morning Recommendation**: Try our "Vinyasa Flow for Mobility" (25 mins) to gently open the thoracic spine, hip flexors, and hamstrings.
- **Form Tip**: In Downward-Facing Dog, focus on pressing your chest toward your thighs and elongating the tailbone upwards before worrying about getting heels flat on the mat.

What specific area of your body feels tight today (hips, shoulders, lower back)?`;
  }

  if (query.includes("plan") || query.includes("schedule") || query.includes("routine")) {
    return `Based on your goal of **${profile.goal || "Balanced Wellness"}** and **${profile.experienceLevel || "Intermediate"}** level, here is an ideal weekly cadence:

- **Mon**: Vinyasa Yoga Power Flow (30 mins) - Core & Postural Strength
- **Tue**: HIIT Conditioning & Agility (25 mins) - Cardiovascular Peak
- **Wed**: Mindful Rest & 10-min Evening Pranayama Breathwork
- **Thu**: Functional Full-Body Strength (35 mins) - Muscle Tone
- **Fri**: Restorative Hip & Spine Yoga (20 mins) - Deep Decompression
- **Sat**: Cardio Sculpt or Outdoor Active Walk (40 mins)
- **Sun**: Guided Meditation & Weekly Reflection (15 mins)

You can view and check off this customized schedule anytime in your **Personalized Plan** tab!`;
  }

  return `Hello ${name}! As your ZenFit Coach, I'm here to help you achieve balance, sustained energy, and physical vitality. 

To give you the best guidance:
- **Yoga & Mobility**: Inquire about specific asanas, transitions, or tight hips/back.
- **Workouts**: Ask for custom HIIT, dumbbells, or bodyweight conditioning.
- **Breathwork**: Learn 4-7-8 calming or Box breathing techniques for stress relief.

What would you like to focus on right now?`;
}

function generateDefaultPlan(goal: string = "Balanced Wellness", level: string = "Intermediate", time: number = 30) {
  return {
    planTitle: `${level} ${goal} Mastery Plan`,
    summary: `A carefully balanced 7-day progression blending yoga flows, functional resistance, and restorative breathwork tailored for ${time}-minute daily sessions.`,
    weeklyFocus: "Spinal mobility, functional endurance, and mindful recovery",
    days: [
      {
        dayName: "Monday",
        workoutTitle: "Sunrise Vinyasa Flow",
        category: "Yoga",
        duration: time,
        calories: Math.round(time * 6.5),
        intensity: "Moderate",
        description: "Energizing morning flow focusing on Sun Salutations, Warrior sequences, and core balance.",
        exercises: ["Surya Namaskar A (3 rounds)", "Warrior II to Reverse Warrior", "Triangle Pose (Trikonasana)", "Seated Forward Fold"],
      },
      {
        dayName: "Tuesday",
        workoutTitle: "Full-Body Functional Strength",
        category: "Strength",
        duration: time,
        calories: Math.round(time * 8.2),
        intensity: "Challenging",
        description: "Dumbbell and bodyweight compound circuit targeting postural chain, quads, and shoulders.",
        exercises: ["Goblet Squats", "Push-ups with Knee Tuck", "Dumbbell Renegade Rows", "Glute Bridge Pulses"],
      },
      {
        dayName: "Wednesday",
        workoutTitle: "Spine & Deep Hip Restorative",
        category: "Mobility",
        duration: Math.max(15, time - 10),
        calories: Math.round(time * 3.8),
        intensity: "Gentle",
        description: "Long-held passive Yin poses to decompress the lumbar spine and release hip flexors.",
        exercises: ["Child's Pose (Balasana)", "Dragon Pose (Low Lunge)", "Pigeon Pose", "Supine Spinal Twist"],
      },
      {
        dayName: "Thursday",
        workoutTitle: "Cardio HIIT Sculpt",
        category: "Cardio",
        duration: time,
        calories: Math.round(time * 9.5),
        intensity: "Challenging",
        description: "High-intensity intervals designed to spike metabolic rate and build athletic cardiovascular resilience.",
        exercises: ["Jumping Lunges", "Mountain Climbers", "Skaters with Reach", "High Plank Shoulder Taps"],
      },
      {
        dayName: "Friday",
        workoutTitle: "Core Balance & Asana Integration",
        category: "Yoga",
        duration: time,
        calories: Math.round(time * 5.8),
        intensity: "Moderate",
        description: "Engaging the deep transversus abdominis and obliques through static holds and fluid breath.",
        exercises: ["Navasana (Boat Pose)", "Side Plank (Vasisthasana)", "Bird Dog with Hold", "Locust Pose"],
      },
      {
        dayName: "Saturday",
        workoutTitle: "Athletic Conditioning & Agility",
        category: "Strength",
        duration: time,
        calories: Math.round(time * 7.8),
        intensity: "Moderate",
        description: "Dynamic multi-planar movements to build stamina, balance, and joint integrity.",
        exercises: ["Lateral Lunges", "Dumbbell Thrusters", "Deadbugs", "Bear Crawl Hold"],
      },
      {
        dayName: "Sunday",
        workoutTitle: "Mindful Meditation & Pranayama Reset",
        category: "Rest",
        duration: 20,
        calories: 60,
        intensity: "Gentle",
        description: "Guided conscious breathing and whole-body scan to lower cortisol and reset the nervous system.",
        exercises: ["Box Breathing (4-4-4-4)", "Diaphragmatic Belly Breaths", "Full Body Scan Meditation", "Savasana"],
      },
    ],
  };
}

// Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ZenFit server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
