"""
SOS Crisis System Routes
Handles panic button, crisis resources, and de-escalation
Production-ready with Firebase Firestore integration
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timezone, timedelta
import uuid

# Firebase imports
try:
    from server import db, get_sos_ref, get_couple_ref, get_user_ref
    FIREBASE_AVAILABLE = db is not None
except ImportError:
    FIREBASE_AVAILABLE = False
    db = None
    get_sos_ref = None
    get_couple_ref = None
    get_user_ref = None

router = APIRouter(prefix="/api/sos", tags=["sos"])

# In-memory storage (fallback)
sos_sessions: Dict[str, Any] = {}
crisis_logs: List[Dict] = []


# =============================================================================
# Crisis Resources Database
# =============================================================================

CRISIS_RESOURCES = {
    "immediate": [
        {
            "id": "988",
            "name": "988 Suicide & Crisis Lifeline",
            "phone": "988",
            "text": "988",
            "description": "24/7 free and confidential support for people in distress",
            "url": "https://988lifeline.org",
            "icon": "phone"
        },
        {
            "id": "crisis-text",
            "name": "Crisis Text Line",
            "phone": None,
            "text": "HOME to 741741",
            "description": "Free 24/7 support via text message",
            "url": "https://www.crisistextline.org",
            "icon": "message"
        },
        {
            "id": "emergency",
            "name": "Emergency Services",
            "phone": "911",
            "text": None,
            "description": "For immediate life-threatening emergencies",
            "url": None,
            "icon": "alert"
        }
    ],
    "couples": [
        {
            "id": "gottman",
            "name": "Gottman Referral Network",
            "phone": "1-888-523-9042",
            "description": "Find a Gottman-trained couples therapist near you",
            "url": "https://www.gottmanreferralnetwork.com",
            "icon": "users"
        },
        {
            "id": "aamft",
            "name": "American Association for Marriage and Family Therapy",
            "phone": None,
            "description": "Find a licensed marriage and family therapist",
            "url": "https://www.therapistlocator.net",
            "icon": "user-check"
        },
        {
            "id": "psychology-today",
            "name": "Psychology Today Therapist Finder",
            "phone": None,
            "description": "Search for therapists by specialty and location",
            "url": "https://www.psychologytoday.com/us/therapists",
            "icon": "search"
        }
    ],
    "de_escalation_games": [
        {
            "id": "six-second-kiss",
            "name": "6-Second Kiss",
            "description": "A 6-second kiss to release oxytocin and reset emotional state",
            "duration": "2 minutes",
            "category": "romance-hub",
            "icon": "heart",
            "difficulty": "easy"
        },
        {
            "id": "eye-contact",
            "name": "Eye Contact Challenge",
            "description": "2 minutes of silent eye contact to re-establish connection",
            "duration": "5 minutes",
            "category": "emotional-connection",
            "icon": "eye",
            "difficulty": "easy"
        },
        {
            "id": "gratitude-cloud",
            "name": "Gratitude Cloud",
            "description": "Share 3 things you appreciate about each other",
            "duration": "10 minutes",
            "category": "emotional-connection",
            "icon": "cloud",
            "difficulty": "easy"
        },
        {
            "id": "repair-attempt",
            "name": "Repair Attempt",
            "description": "Practice the art of the repair attempt with structured prompts",
            "duration": "10 minutes",
            "category": "conflict-resolution",
            "icon": "tool",
            "difficulty": "medium"
        },
        {
            "id": "box-breathing-together",
            "name": "Box Breathing Together",
            "description": "Synchronize your breathing to calm the nervous system",
            "duration": "3 minutes",
            "category": "emotional-connection",
            "icon": "wind",
            "difficulty": "easy"
        }
    ],
    "self_regulation": [
        {
            "id": "box-breathing",
            "name": "Box Breathing",
            "description": "Inhale 4s, hold 4s, exhale 4s, hold 4s. Repeat 4 times.",
            "duration": "2 minutes",
            "icon": "square",
            "steps": [
                "Inhale slowly through your nose for 4 counts",
                "Hold your breath for 4 counts",
                "Exhale slowly through your mouth for 4 counts",
                "Hold empty for 4 counts",
                "Repeat 4 times"
            ]
        },
        {
            "id": "physiological-sigh",
            "name": "Physiological Sigh",
            "description": "Double inhale through nose, long exhale through mouth",
            "duration": "1 minute",
            "icon": "wind",
            "steps": [
                "Take a deep inhale through your nose",
                "Take a second short inhale (top-up breath)",
                "Exhale slowly and fully through your mouth",
                "Repeat 3 times"
            ]
        },
        {
            "id": "grounding-5-4-3-2-1",
            "name": "5-4-3-2-1 Grounding",
            "description": "Use your senses to return to the present moment",
            "duration": "3 minutes",
            "icon": "anchor",
            "steps": [
                "Name 5 things you can see right now",
                "Name 4 things you can touch/feel",
                "Name 3 things you can hear",
                "Name 2 things you can smell",
                "Name 1 thing you can taste"
            ]
        },
        {
            "id": "cold-water",
            "name": "Cold Water Reset",
            "description": "Splash cold water on your face or hold ice cubes",
            "duration": "1 minute",
            "icon": "droplet",
            "steps": [
                "Run cold water",
                "Splash your face or hold cold water on wrists",
                "Notice the temperature sensation",
                "Take 3 deep breaths"
            ]
        }
    ],
    "partner_communication": [
        {
            "id": "time-out-signal",
            "name": "Time-Out Signal",
            "description": "Agree on a hand signal or word for when you need a break",
            "duration": "immediate",
            "icon": "hand"
        },
        {
            "id": "i-feel-statement",
            "name": "I Feel Statement Template",
            "description": "I feel _____ when you _____ because I need _____.",
            "duration": "5 minutes",
            "icon": "message-circle"
        }
    ]
}


# =============================================================================
# Pydantic Models
# =============================================================================

class SOSCreateRequest(BaseModel):
    user_id: str
    couple_id: Optional[str] = None
    trigger: Optional[str] = Field(None, description="What triggered the crisis", max_length=500)
    severity: int = Field(default=3, ge=1, le=5, description="Severity level 1-5")
    location: Optional[str] = None
    notify_partner: bool = True
    use_iceberg_method: bool = False


class SOSResolveRequest(BaseModel):
    user_id: str
    resolution_notes: Optional[str] = None
    used_game: Optional[str] = None
    used_resource: Optional[str] = None
    feeling_better: Optional[bool] = None
    would_recommend: Optional[int] = Field(None, ge=1, le=5)


class SOSEscalateRequest(BaseModel):
    user_id: str
    reason: Optional[str] = None


class SOSBoothSubmission(BaseModel):
    user_id: str
    i_feel: str = Field(..., min_length=1, max_length=500)
    when_partner: str = Field(..., min_length=1, max_length=500)
    because_i_tell_myself: str = Field(..., min_length=1, max_length=500)
    what_i_need: str = Field(..., min_length=1, max_length=500)


class SOSResponse(BaseModel):
    id: str
    user_id: str
    couple_id: Optional[str]
    status: str  # active, resolved, escalated
    triggered_at: str
    resolved_at: Optional[str]
    severity: int
    trigger: Optional[str]
    resources_sent: bool
    partner_notified: bool


# =============================================================================
# Helper Functions
# =============================================================================

async def notify_partner(couple_id: str, sos_id: str, initiator_id: str):
    """Notify partner about SOS trigger (WebSocket or Push Notification)"""
    # This would integrate with your push notification service
    # For now, we log it
    print(f"[SOS] Notifying partner in couple {couple_id} about SOS {sos_id}")
    
    # In production, send push notification via:
    # - Firebase Cloud Messaging
    # - OneSignal
    # - Pusher Beams
    
    return True


def get_partner_id(couple_id: str, initiator_id: str) -> Optional[str]:
    """Get the partner's user ID from couple data"""
    try:
        if FIREBASE_AVAILABLE and get_couple_ref:
            doc = get_couple_ref(couple_id).get()
            if doc.exists:
                data = doc.to_dict()
                if data.get("user1_id") == initiator_id:
                    return data.get("user2_id")
                else:
                    return data.get("user1_id")
    except Exception as e:
        print(f"Error getting partner: {e}")
    return None


# =============================================================================
# Routes
# =============================================================================

@router.post("/trigger", response_model=SOSResponse)
async def trigger_sos(
    request: SOSCreateRequest,
    background_tasks: BackgroundTasks
):
    """
    Trigger an SOS crisis session.
    Sends notifications to partner and provides crisis resources.
    """
    sos_id = str(uuid.uuid4())
    triggered_at = datetime.now(timezone.utc).isoformat()
    
    sos_data = {
        "id": sos_id,
        "user_id": request.user_id,
        "couple_id": request.couple_id,
        "status": "active",
        "triggered_at": triggered_at,
        "resolved_at": None,
        "escalated_at": None,
        "severity": request.severity,
        "trigger": request.trigger,
        "location": request.location,
        "resources_sent": True,
        "partner_notified": False,
        "use_iceberg_method": request.use_iceberg_method,
        "booth_submissions": {},
        "notes": [],
        "resolution": None
    }
    
    try:
        if FIREBASE_AVAILABLE and get_sos_ref:
            get_sos_ref(sos_id).set(sos_data)
        else:
            sos_sessions[sos_id] = sos_data
        
        # Log crisis
        crisis_logs.append({
            "sos_id": sos_id,
            "user_id": request.user_id,
            "severity": request.severity,
            "timestamp": triggered_at
        })
        
        # Notify partner if couple_id provided
        if request.couple_id and request.notify_partner:
            sos_data["partner_notified"] = True
            background_tasks.add_task(notify_partner, request.couple_id, sos_id, request.user_id)
        
        return sos_data
        
    except Exception as e:
        print(f"Error triggering SOS: {e}")
        raise HTTPException(status_code=500, detail="Failed to trigger SOS")


@router.get("/resources")
async def get_crisis_resources(category: Optional[str] = None):
    """
    Get crisis resources and de-escalation tools.
    
    Categories:
    - immediate: Emergency hotlines
    - couples: Couples therapy resources
    - de_escalation_games: Games to calm tensions
    - self_regulation: Individual regulation techniques
    - partner_communication: Communication tools
    """
    if category:
        if category not in CRISIS_RESOURCES:
            raise HTTPException(status_code=404, detail="Category not found")
        return {
            "category": category,
            "resources": CRISIS_RESOURCES[category]
        }
    
    return {
        "categories": list(CRISIS_RESOURCES.keys()),
        "resources": CRISIS_RESOURCES,
        "emergency_note": "If you or someone you know is in immediate danger, call 911 or your local emergency number.",
        "disclaimer": "These resources are for support only and do not replace professional mental health care."
    }


@router.get("/resources/recommended")
async def get_recommended_resources(user_id: str, severity: int = 3, context: Optional[str] = None):
    """
    Get personalized crisis resources based on severity and context.
    """
    recommendations = []
    
    # Immediate resources for high severity
    if severity >= 4:
        recommendations.append({
            "priority": "urgent",
            "type": "immediate",
            "message": "Your safety is important. These resources are available 24/7:",
            "resources": CRISIS_RESOURCES["immediate"]
        })
    
    # De-escalation games for couple conflicts
    if severity <= 4:
        recommendations.append({
            "priority": "suggested",
            "type": "de_escalation",
            "message": "Try these quick connection exercises to reset:",
            "resources": CRISIS_RESOURCES["de_escalation_games"][:3]
        })
    
    # Self-regulation for individual distress
    if severity >= 2:
        recommendations.append({
            "priority": "suggested",
            "type": "self_regulation",
            "message": "Take a moment to regulate your nervous system:",
            "resources": CRISIS_RESOURCES["self_regulation"][:2]
        })
    
    # Communication tools for couple conflicts
    if severity <= 3:
        recommendations.append({
            "priority": "optional",
            "type": "communication",
            "message": "When you're ready to talk:",
            "resources": CRISIS_RESOURCES["partner_communication"]
        })
    
    return {
        "user_id": user_id,
        "severity": severity,
        "context": context,
        "recommendations": recommendations,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }


@router.post("/{sos_id}/booth/submit")
async def submit_sos_booth(sos_id: str, submission: SOSBoothSubmission):
    """
    Submit a response in the SOS Booth (Iceberg Method).
    Each partner submits their feelings using the structured format.
    """
    try:
        if FIREBASE_AVAILABLE and get_sos_ref:
            doc = get_sos_ref(sos_id).get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail="SOS session not found")
            sos_data = doc.to_dict()
        else:
            if sos_id not in sos_sessions:
                raise HTTPException(status_code=404, detail="SOS session not found")
            sos_data = sos_sessions[sos_id]
        
        # Verify user is part of the couple
        if sos_data.get("user_id") != submission.user_id:
            couple_id = sos_data.get("couple_id")
            if couple_id:
                partner_id = get_partner_id(couple_id, sos_data.get("user_id"))
                if partner_id != submission.user_id:
                    raise HTTPException(status_code=403, detail="Not authorized to submit to this SOS")
        
        # Store submission
        booth_data = {
            "i_feel": submission.i_feel,
            "when_partner": submission.when_partner,
            "because_i_tell_myself": submission.because_i_tell_myself,
            "what_i_need": submission.what_i_need,
            "submitted_at": datetime.now(timezone.utc).isoformat()
        }
        
        if "booth_submissions" not in sos_data:
            sos_data["booth_submissions"] = {}
        
        sos_data["booth_submissions"][submission.user_id] = booth_data
        
        # Check if both have submitted
        if len(sos_data["booth_submissions"]) == 2:
            sos_data["status"] = "analyzing"
            # In production, trigger AI analysis here
        
        # Update storage
        if FIREBASE_AVAILABLE and get_sos_ref:
            get_sos_ref(sos_id).update({
                "booth_submissions": sos_data["booth_submissions"],
                "status": sos_data["status"]
            })
        else:
            sos_sessions[sos_id] = sos_data
        
        return {
            "success": True,
            "submission": booth_data,
            "both_submitted": len(sos_data["booth_submissions"]) == 2
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error submitting booth: {e}")
        raise HTTPException(status_code=500, detail="Failed to submit booth response")


@router.get("/{sos_id}/booth/results")
async def get_sos_booth_results(sos_id: str, user_id: str):
    """
    Get the booth results once both partners have submitted.
    """
    try:
        if FIREBASE_AVAILABLE and get_sos_ref:
            doc = get_sos_ref(sos_id).get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail="SOS session not found")
            sos_data = doc.to_dict()
        else:
            if sos_id not in sos_sessions:
                raise HTTPException(status_code=404, detail="SOS session not found")
            sos_data = sos_sessions[sos_id]
        
        # Verify authorization
        if sos_data.get("user_id") != user_id:
            couple_id = sos_data.get("couple_id")
            if couple_id:
                partner_id = get_partner_id(couple_id, sos_data.get("user_id"))
                if partner_id != user_id:
                    raise HTTPException(status_code=403, detail="Not authorized")
        
        submissions = sos_data.get("booth_submissions", {})
        
        if len(submissions) < 2:
            return {
                "ready": False,
                "message": "Waiting for both partners to submit...",
                "submissions_count": len(submissions)
            }
        
        # Generate insights (in production, use AI)
        insights = {
            "common_themes": ["Both partners want to feel heard", "There's a need for clearer communication"],
            "suggested_games": ["repair-attempt", "tone-shift"],
            "next_steps": [
                "Schedule a time to discuss when both are calm",
                "Practice active listening",
                "Consider the 'I feel' statements you both shared"
            ]
        }
        
        return {
            "ready": True,
            "submissions": submissions,
            "insights": insights,
            "generated_at": datetime.now(timezone.utc).isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting booth results: {e}")
        raise HTTPException(status_code=500, detail="Failed to get booth results")


@router.post("/{sos_id}/resolve")
async def resolve_sos(sos_id: str, request: SOSResolveRequest):
    """
    Mark an SOS session as resolved.
    """
    try:
        if FIREBASE_AVAILABLE and get_sos_ref:
            doc = get_sos_ref(sos_id).get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail="SOS session not found")
            sos_data = doc.to_dict()
        else:
            if sos_id not in sos_sessions:
                raise HTTPException(status_code=404, detail="SOS session not found")
            sos_data = sos_sessions[sos_id]
        
        # Verify user is authorized (initiator or partner)
        authorized = sos_data["user_id"] == request.user_id
        if not authorized and sos_data.get("couple_id"):
            partner_id = get_partner_id(sos_data["couple_id"], sos_data["user_id"])
            authorized = partner_id == request.user_id
        
        if not authorized:
            raise HTTPException(status_code=403, detail="Not authorized to resolve this SOS")
        
        if sos_data["status"] not in ["active", "analyzing"]:
            raise HTTPException(status_code=400, detail="SOS session already resolved or escalated")
        
        # Update SOS data
        resolved_at = datetime.now(timezone.utc).isoformat()
        resolution_data = {
            "status": "resolved",
            "resolved_at": resolved_at,
            "resolved_by": request.user_id,
            "resolution_notes": request.resolution_notes,
            "used_game": request.used_game,
            "used_resource": request.used_resource,
            "feeling_better": request.feeling_better,
            "would_recommend": request.would_recommend
        }
        
        if FIREBASE_AVAILABLE and get_sos_ref:
            get_sos_ref(sos_id).update(resolution_data)
        else:
            sos_sessions[sos_id].update(resolution_data)
        
        return {
            "success": True,
            "sos_id": sos_id,
            "resolved_at": resolved_at,
            "message": "Crisis session marked as resolved. Take care of yourself. 💜"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error resolving SOS: {e}")
        raise HTTPException(status_code=500, detail="Failed to resolve SOS")


@router.post("/{sos_id}/escalate")
async def escalate_sos(sos_id: str, request: SOSEscalateRequest):
    """
    Escalate an SOS session (indicates need for professional help).
    """
    try:
        if FIREBASE_AVAILABLE and get_sos_ref:
            doc = get_sos_ref(sos_id).get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail="SOS session not found")
            sos_data = doc.to_dict()
        else:
            if sos_id not in sos_sessions:
                raise HTTPException(status_code=404, detail="SOS session not found")
            sos_data = sos_sessions[sos_id]
        
        escalated_at = datetime.now(timezone.utc).isoformat()
        
        update_data = {
            "status": "escalated",
            "escalated_at": escalated_at,
            "escalated_by": request.user_id,
            "escalation_reason": request.reason
        }
        
        if FIREBASE_AVAILABLE and get_sos_ref:
            get_sos_ref(sos_id).update(update_data)
        else:
            sos_sessions[sos_id].update(update_data)
        
        return {
            "success": True,
            "sos_id": sos_id,
            "status": "escalated",
            "message": "Professional resources have been prioritized.",
            "immediate_resources": CRISIS_RESOURCES["immediate"],
            "couples_resources": CRISIS_RESOURCES["couples"]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error escalating SOS: {e}")
        raise HTTPException(status_code=500, detail="Failed to escalate SOS")


@router.get("/{sos_id}")
async def get_sos_session(sos_id: str, user_id: str):
    """
    Get details of an SOS session.
    """
    try:
        if FIREBASE_AVAILABLE and get_sos_ref:
            doc = get_sos_ref(sos_id).get()
            if not doc.exists:
                raise HTTPException(status_code=404, detail="SOS session not found")
            sos_data = doc.to_dict()
        else:
            if sos_id not in sos_sessions:
                raise HTTPException(status_code=404, detail="SOS session not found")
            sos_data = sos_sessions[sos_id]
        
        # Verify authorization
        authorized = sos_data["user_id"] == user_id
        if not authorized and sos_data.get("couple_id"):
            partner_id = get_partner_id(sos_data["couple_id"], sos_data["user_id"])
            authorized = partner_id == user_id
        
        if not authorized:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        return sos_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting SOS: {e}")
        raise HTTPException(status_code=500, detail="Failed to get SOS session")


@router.get("/user/{user_id}/history")
async def get_user_sos_history(user_id: str, limit: int = 10):
    """
    Get SOS history for a user (for pattern recognition).
    """
    try:
        if FIREBASE_AVAILABLE and db:
            # Query Firestore
            sos_ref = db.collection('sos_sessions')
            query = sos_ref.where('user_id', '==', user_id).order_by('triggered_at', direction=firestore.Query.DESCENDING).limit(limit)
            user_sessions = [{**doc.to_dict(), "id": doc.id} for doc in query.stream()]
        else:
            # In-memory fallback
            user_sessions = [
                {**s, "id": sid} for sid, s in sos_sessions.items()
                if s["user_id"] == user_id
            ]
            user_sessions.sort(key=lambda x: x["triggered_at"], reverse=True)
            user_sessions = user_sessions[:limit]
        
        # Calculate patterns
        total_sessions = len(user_sessions)
        resolved_count = sum(1 for s in user_sessions if s.get("status") == "resolved")
        escalated_count = sum(1 for s in user_sessions if s.get("status") == "escalated")
        avg_severity = sum(s.get("severity", 3) for s in user_sessions) / total_sessions if total_sessions > 0 else 0
        
        # Common triggers
        triggers = {}
        for s in user_sessions:
            trigger = s.get("trigger")
            if trigger:
                triggers[trigger] = triggers.get(trigger, 0) + 1
        
        return {
            "user_id": user_id,
            "sessions": user_sessions,
            "total_count": total_sessions,
            "patterns": {
                "average_severity": round(avg_severity, 2),
                "resolved_count": resolved_count,
                "escalated_count": escalated_count,
                "resolution_rate": round(resolved_count / total_sessions * 100, 1) if total_sessions > 0 else 0,
                "common_triggers": sorted(triggers.items(), key=lambda x: x[1], reverse=True)[:3]
            }
        }
        
    except Exception as e:
        print(f"Error getting SOS history: {e}")
        raise HTTPException(status_code=500, detail="Failed to get SOS history")
