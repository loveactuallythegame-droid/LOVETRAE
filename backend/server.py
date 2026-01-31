from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import os
import uuid
import asyncio
from datetime import datetime, timezone
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Love Actually - The Game API")

# CORS for Expo web
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory stores (will migrate to Firebase)
users_db: Dict[str, Any] = {}
couples_db: Dict[str, Any] = {}
game_sessions_db: Dict[str, Any] = {}
sos_sessions_db: Dict[str, Any] = {}

# Dr. Marcie Sarcasm Levels
SARCASM_LEVELS = {
    1: {
        "name": "Tough Love Rookie",
        "description": "Mild sarcasm, warm but blunt",
        "system_prompt": """You are Dr. Marcie Liss, a witty AI therapist. At Level 1 (Tough Love Rookie), you're like a straight-talking aunt who loves them but doesn't sugarcoat. Use mild sarcasm and warm, blunt advice. Examples:
- "Sweetheart, if ignoring red flags were an Olympic sport, you'd have gold."
- "Love is blind, but girl, your denial needs prescription lenses."
"""
    },
    2: {
        "name": "Reality Check Specialist",
        "description": "Clinical, analytical sarcasm",
        "system_prompt": """You are Dr. Marcie Liss, a witty AI therapist. At Level 2 (Reality Check Specialist), you use clinical, analytical sarcasm with scientific detachment. Examples:
- "Your attachment style is showing. Loudly."
- "If avoidance were a career path, you'd be CEO of 'It's Fine Inc.'"
"""
    },
    3: {
        "name": "Radical Truth Wizard",
        "description": "Deep, powerful, poetic truth",
        "system_prompt": """You are Dr. Marcie Liss, a witty AI therapist. At Level 3 (Radical Truth Wizard), you deliver deep, powerful truth with poetic weight. No BS. Gentle but searing. Examples:
- "You're not broken, but you are bleeding—and you keep trying to dance in the fire."
- "Stop searching for closure in open wounds."
"""
    },
    4: {
        "name": "The Glamour Oracle",
        "description": "Full Noir Prophecy Mode - Maya Angelou meets Joan Rivers",
        "system_prompt": """You are Dr. Marcie Liss, a witty AI therapist. At Level 4 (The Glamour Oracle), you channel Maya Angelou meets Joan Rivers in a 1950s noir detective's office. Fierce compassion, elegant clarity, refined sarcasm. Examples:
- "You keep choosing people who love you like a footnote—yet you were written to be the title page. Let's edit."
- "You're not failing at love. You're graduating from the school of 'How to Disappear While Standing Naked in the Room.'"
"""
    }
}

# Game Categories (including Love Arcade)
GAME_CATEGORIES = [
    {
        "id": "emotional-connection",
        "name": "Emotional Connection",
        "description": "SEEN Method focused games",
        "icon": "heart",
        "color": "#FA1F63",
        "games": ["truth-or-trust", "gratitude-cloud", "eye-contact-challenge", "memory-lane-map", "vibe-check"]
    },
    {
        "id": "conflict-resolution",
        "name": "Conflict Resolution",
        "description": "Gottman-inspired games",
        "icon": "shield",
        "color": "#33DEA5",
        "games": ["slap-of-truth", "apology-auction", "defensiveness-detox", "whos-right", "stress-test"]
    },
    {
        "id": "creative-chaos",
        "name": "Creative Chaos",
        "description": "Playful, creative challenges",
        "icon": "sparkles",
        "color": "#E4E831",
        "games": ["role-swap-roast", "draw-your-feelings", "gif-battle", "karaoke-confessional", "ransom-note"]
    },
    {
        "id": "romance-hub",
        "name": "Romance Hub",
        "description": "Spicy & sweet connections",
        "icon": "flame",
        "color": "#BE1980",
        "games": ["date-night-roulette", "bedroom-bingo", "six-second-kiss", "foreplay-slider", "touch-map"]
    },
    {
        "id": "healing-hospital",
        "name": "Healing Hospital",
        "description": "Deep repair & recovery",
        "icon": "medkit",
        "color": "#5C1459",
        "games": ["windows-and-walls", "trigger-triage", "trust-bank", "the-iceberg", "secrecy-audit"]
    },
    {
        "id": "game-show",
        "name": "Game Show",
        "description": "Classic game show formats",
        "icon": "trophy",
        "color": "#22d3ee",
        "games": ["couples-jeopardy", "relationship-millionaire", "family-feud-couples", "newlywed-sync", "wheel-of-intimacy"]
    },
    {
        "id": "love-arcade",
        "name": "The Love Arcade",
        "description": "Championship matches of honesty, wit, and emotional parkour",
        "icon": "game-controller",
        "color": "#FF6B6B",
        "games": ["truth-teller-tower", "echo-chamber-escape", "intimacy-feud", "relational-jeopardy", "family-forge", "harbor-storm"]
    }
]

# Models
class UserCreate(BaseModel):
    email: str
    display_name: str
    
class UserResponse(BaseModel):
    id: str
    email: str
    display_name: str
    partner_id: Optional[str] = None
    couple_code: Optional[str] = None
    sarcasm_level: int = 1
    trust_level: float = 0.5
    vulnerability_level: float = 0.5
    points: int = 0
    plan: str = "free"
    created_at: str

class CoupleLinkRequest(BaseModel):
    user_id: str
    partner_code: str

class GameSessionCreate(BaseModel):
    user_id: str
    game_id: str
    category_id: str

class GameSessionUpdate(BaseModel):
    score: Optional[int] = None
    completed: Optional[bool] = None
    responses: Optional[List[Dict]] = None

class SOSSessionCreate(BaseModel):
    initiator_id: str
    couple_id: str

class SOSBoothSubmission(BaseModel):
    session_id: str
    user_id: str
    i_feel: str
    when_partner: str
    because_i_tell_myself: str
    what_i_need: str

class MarcieRequest(BaseModel):
    user_id: str
    context: str
    message: str
    sarcasm_level: int = 1
    game_context: Optional[str] = None

class MarcieResponse(BaseModel):
    response: str
    animation: str
    sarcasm_level: int

# Health check
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "app": "Love Actually - The Game", "version": "1.0.0"}

# User endpoints
@app.post("/api/users", response_model=UserResponse)
async def create_user(user: UserCreate):
    user_id = str(uuid.uuid4())
    couple_code = str(uuid.uuid4())[:8].upper()
    
    new_user = {
        "id": user_id,
        "email": user.email,
        "display_name": user.display_name,
        "partner_id": None,
        "couple_code": couple_code,
        "sarcasm_level": 1,
        "trust_level": 0.5,
        "vulnerability_level": 0.5,
        "points": 0,
        "plan": "free",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    users_db[user_id] = new_user
    return new_user

@app.get("/api/users/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    return users_db[user_id]

@app.put("/api/users/{user_id}/sarcasm")
async def update_sarcasm_level(user_id: str, level: int):
    if user_id not in users_db:
        raise HTTPException(status_code=404, detail="User not found")
    if level < 1 or level > 4:
        raise HTTPException(status_code=400, detail="Sarcasm level must be 1-4")
    users_db[user_id]["sarcasm_level"] = level
    return {"success": True, "sarcasm_level": level, "name": SARCASM_LEVELS[level]["name"]}

# Couple Linking
@app.post("/api/couples/link")
async def link_couple(request: CoupleLinkRequest):
    # Find user with the partner code
    partner_user = None
    for uid, user in users_db.items():
        if user.get("couple_code") == request.partner_code and uid != request.user_id:
            partner_user = user
            break
    
    if not partner_user:
        raise HTTPException(status_code=404, detail="Invalid partner code")
    
    if partner_user.get("partner_id"):
        raise HTTPException(status_code=400, detail="Partner already linked to someone else")
    
    # Create couple
    couple_id = str(uuid.uuid4())
    couples_db[couple_id] = {
        "id": couple_id,
        "user1_id": request.user_id,
        "user2_id": partner_user["id"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "trust_meter": 0.5,
        "vulnerability_meter": 0.5,
        "romance_meter": 0.5,
        "connection_meter": 0.5,
        "total_points": 0,
        "streak_days": 0
    }
    
    # Update both users
    users_db[request.user_id]["partner_id"] = partner_user["id"]
    users_db[request.user_id]["couple_id"] = couple_id
    users_db[partner_user["id"]]["partner_id"] = request.user_id
    users_db[partner_user["id"]]["couple_id"] = couple_id
    
    return {
        "success": True,
        "couple_id": couple_id,
        "partner": {
            "id": partner_user["id"],
            "display_name": partner_user["display_name"]
        }
    }

@app.get("/api/couples/{couple_id}")
async def get_couple(couple_id: str):
    if couple_id not in couples_db:
        raise HTTPException(status_code=404, detail="Couple not found")
    return couples_db[couple_id]

# Game Categories
@app.get("/api/games/categories")
async def get_game_categories():
    return {"categories": GAME_CATEGORIES}

@app.get("/api/games/categories/{category_id}")
async def get_category_games(category_id: str):
    for cat in GAME_CATEGORIES:
        if cat["id"] == category_id:
            return cat
    raise HTTPException(status_code=404, detail="Category not found")

# Game Sessions
@app.post("/api/games/sessions")
async def create_game_session(session: GameSessionCreate):
    session_id = str(uuid.uuid4())
    new_session = {
        "id": session_id,
        "user_id": session.user_id,
        "game_id": session.game_id,
        "category_id": session.category_id,
        "started_at": datetime.now(timezone.utc).isoformat(),
        "completed": False,
        "score": 0,
        "responses": []
    }
    game_sessions_db[session_id] = new_session
    return new_session

@app.put("/api/games/sessions/{session_id}")
async def update_game_session(session_id: str, update: GameSessionUpdate):
    if session_id not in game_sessions_db:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = game_sessions_db[session_id]
    if update.score is not None:
        session["score"] = update.score
    if update.completed is not None:
        session["completed"] = update.completed
        if update.completed:
            session["completed_at"] = datetime.now(timezone.utc).isoformat()
    if update.responses is not None:
        session["responses"] = update.responses
    
    return session

# SOS Fight Solver
@app.post("/api/sos/sessions")
async def create_sos_session(sos: SOSSessionCreate):
    session_id = str(uuid.uuid4())
    new_session = {
        "id": session_id,
        "initiator_id": sos.initiator_id,
        "couple_id": sos.couple_id,
        "status": "waiting_for_partner",
        "started_at": datetime.now(timezone.utc).isoformat(),
        "submissions": {},
        "verdict": None
    }
    sos_sessions_db[session_id] = new_session
    return new_session

@app.post("/api/sos/sessions/{session_id}/submit")
async def submit_sos_booth(session_id: str, submission: SOSBoothSubmission):
    if session_id not in sos_sessions_db:
        raise HTTPException(status_code=404, detail="SOS Session not found")
    
    session = sos_sessions_db[session_id]
    session["submissions"][submission.user_id] = {
        "i_feel": submission.i_feel,
        "when_partner": submission.when_partner,
        "because_i_tell_myself": submission.because_i_tell_myself,
        "what_i_need": submission.what_i_need,
        "submitted_at": datetime.now(timezone.utc).isoformat()
    }
    
    # Check if both partners submitted
    if len(session["submissions"]) >= 2:
        session["status"] = "analyzing"
        # In real app, trigger AI analysis here
    elif len(session["submissions"]) == 1:
        session["status"] = "one_submitted"
    
    return session

@app.get("/api/sos/sessions/{session_id}")
async def get_sos_session(session_id: str):
    if session_id not in sos_sessions_db:
        raise HTTPException(status_code=404, detail="SOS Session not found")
    return sos_sessions_db[session_id]

# Dr. Marcie AI Endpoint
@app.post("/api/marcie/chat", response_model=MarcieResponse)
async def chat_with_marcie(request: MarcieRequest):
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage
        
        api_key = os.environ.get("EMERGENT_LLM_KEY", "")
        if not api_key:
            raise HTTPException(status_code=500, detail="LLM API key not configured")
        
        sarcasm_config = SARCASM_LEVELS.get(request.sarcasm_level, SARCASM_LEVELS[1])
        system_message = sarcasm_config["system_prompt"]
        
        if request.game_context:
            system_message += f"\n\nGame Context: {request.game_context}"
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"marcie-{request.user_id}-{uuid.uuid4()}",
            system_message=system_message
        ).with_model("openai", "gpt-4o")
        
        user_message = UserMessage(
            text=f"Context: {request.context}\n\nUser says: {request.message}\n\nRespond as Dr. Marcie Liss with your signature wit and therapeutic insight. Keep response under 150 words."
        )
        
        response = await chat.send_message(user_message)
        
        # Determine animation based on response sentiment
        animation = "marcie-idle"
        response_lower = response.lower()
        if any(word in response_lower for word in ["proud", "amazing", "excellent", "wow"]):
            animation = "marcie-correct"
        elif any(word in response_lower for word in ["hmm", "interesting", "let me think"]):
            animation = "marcie-thinking"
        elif any(word in response_lower for word in ["ouch", "yikes", "oh no"]):
            animation = "marcie-shocked"
        elif any(word in response_lower for word in ["ha", "laugh", "funny"]):
            animation = "marcie-laugh"
        
        return MarcieResponse(
            response=response,
            animation=animation,
            sarcasm_level=request.sarcasm_level
        )
        
    except ImportError:
        # Fallback response if emergentintegrations not available
        fallback_responses = [
            "Sweetheart, if avoiding tough conversations were cardio, you'd be an Olympic athlete. Let's talk.",
            "That's not a red flag, darling—that's a red circus tent. With elephants.",
            "Communication isn't mind-reading. Use words, not vibes.",
            "Apologies without change are just performance art."
        ]
        import random
        return MarcieResponse(
            response=random.choice(fallback_responses),
            animation="marcie-idle",
            sarcasm_level=request.sarcasm_level
        )

# Love Arcade specific endpoints
@app.get("/api/love-arcade/games")
async def get_love_arcade_games():
    """Get all Love Arcade games with their detailed configs"""
    return {
        "games": [
            {
                "id": "truth-teller-tower",
                "name": "Truth Teller Tower",
                "phase": "Foundation (Phase 1)",
                "format": "Who Wants to Be a Millionaire meets The Newlywed Game",
                "description": "Scale the lie-avalanche. Five questions. Three lifelines. One shared brain.",
                "max_score": 100,
                "lifelines": ["50/50", "Double Confidence", "Trust Check"],
                "scoring": {
                    "correct_answer": 10,
                    "predicted_partner": 5,
                    "double_truth": 20
                }
            },
            {
                "id": "echo-chamber-escape",
                "name": "Escape from the Echo Chamber",
                "phase": "Deconstruction (Phase 2)",
                "format": "Digital Escape Room",
                "description": "Trapped in a hall of infinite mirrors. Break the loop together.",
                "max_score": 100,
                "time_limit_per_puzzle": 90,
                "puzzles": 5
            },
            {
                "id": "intimacy-feud",
                "name": "The Intimacy Feud",
                "phase": "Shared Reality (Phase 3)",
                "format": "Family Feud style",
                "description": "Survey says... be boring. Be authentic. Be real.",
                "max_score": 250,
                "scoring": {
                    "1st_place": 50,
                    "2nd_place": 30,
                    "3rd_place": 20,
                    "partner_match": 10,
                    "authenticity_streak": 15
                }
            },
            {
                "id": "relational-jeopardy",
                "name": "Relational Jeopardy!",
                "phase": "The Future (Phase 4)",
                "format": "Jeopardy style",
                "description": "Categories designed by couples who rebuilt.",
                "max_score": 2000,
                "categories": ["Accountability Plans", "Redefinition", "Integration"],
                "has_daily_double": True,
                "has_final_jeopardy": True
            },
            {
                "id": "family-forge",
                "name": "Family Forge Edition",
                "phase": "Special - Family Building",
                "format": "Mixed game show formats",
                "description": "For couples forging families after betrayal.",
                "max_score": 1800,
                "sub_games": ["Family Feud: Our New Reality", "The Newlywed Game: Heart-to-Heart", "Chopped: Family Kitchen", "The Amazing Race: Legacy Dash"]
            },
            {
                "id": "harbor-storm",
                "name": "Harbor & Storm Edition",
                "phase": "Special - BPD/Emotional Regulation",
                "format": "Cooperative challenges",
                "description": "Build a better boat. Learn to sail as a crew.",
                "max_score": 1900,
                "sub_games": ["BPD Pattern Detective", "Validation Game Show", "Connection Constructor", "Harbor Master's Challenge"]
            }
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
