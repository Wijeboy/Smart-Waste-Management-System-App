# 🎨 Homepage Redesign - Detailed Mockup & Wireframe

**Based on Screenshot Analysis**  
**Date:** Oct 16, 2025, 10:22 PM IST  
**Status:** Ready for Implementation

---

## 📱 Screen Overview

```
┌─────────────────────────────────────────┐
│ ═══════════════════════════════════════ │ ← Status Bar (iOS)
│ 9:41                        ▪︎ ◗ ⚡︎ ▓▓▓ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │  🔔   HEADER CARD (Teal #2BA5A0)   │ │
│ │                                     │ │
│ │  Good Morning, Alex! 🧡            │ │
│ │  Route#12 - Central District       │ │
│ │  🕐 4:19:04 PM                      │ │
│ │                                     │ │
│ │  🚛 Route Progress      ⏱ 6% • ETA │ │
│ │  ▓▓▓░░░░░░░░░░░░░░░░░░ (Progress)  │ │
│ │                                     │ │
│ │  ┌──────────────┐ ┌──────────────┐ │ │
│ │  │ ✓  Completed │ │ ↻  Efficiency │ │
│ │  │    47/72     │ │     96%       │ │
│ │  └──────────────┘ └──────────────┘ │ │
│ │     (Blue)           (Green)       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Today's Impact            🌱 ♻️     │ │
│ │                                     │ │
│ │  ♻️         💨         🌳          │ │
│ │  Recycled   CO² Saved  Trees Saved │ │
│ │  1.2 tons   89 kg      3.2         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Today's Collections by Type         │ │
│ │                                     │ │
│ │ 🗑️  General              28      › │ │
│ │     Collected today                │ │
│ │                                     │ │
│ │ ♻️  Recyclable           15      › │ │
│ │     Collected today                │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## 🎯 Component Hierarchy

```
SafeAreaView (backgroundColor: #F5F7FA)
└── ScrollView (with RefreshControl)
    │
    ├── SECTION 1: Header Card (Teal Container)
    │   ├── Status Bar Row
    │   │   ├── Time (9:41)
    │   │   └── Notification Bell 🔔
    │   │
    │   ├── Greeting Section
    │   │   ├── Greeting Text "Good Morning, Alex! 🧡"
    │   │   ├── Route Info "Route#12 - Central District"
    │   │   └── Current Time "🕐 4:19:04 PM"
    │   │
    │   ├── Progress Section (TouchableOpacity)
    │   │   ├── Label Row
    │   │   │   ├── "🚛 Route Progress"
    │   │   │   └── "⏱ 6% • ETA"
    │   │   └── ProgressBar Component
    │   │
    │   └── Header Stats Row
    │       ├── Completed Card (Blue #4A90E2)
    │       │   ├── Icon "✓"
    │       │   ├── Label "Completed"
    │       │   └── Value "47/72"
    │       │
    │       └── Efficiency Card (Green #52C9A8)
    │           ├── Icon "↻"
    │           ├── Label "Efficiency"
    │           └── Value "96%"
    │
    ├── SECTION 2: Impact Section (White Card)
    │   ├── Header Row
    │   │   ├── Title "Today's Impact"
    │   │   └── Icons "🌱 ♻️"
    │   │
    │   └── Impact Cards Row
    │       ├── ImpactCard (Recycled)
    │       ├── ImpactCard (CO² Saved)
    │       └── ImpactCard (Trees Saved)
    │
    └── SECTION 3: Collections Section (White Card)
        ├── Title "Today's Collections by Type"
        │
        └── Collection Items List
            ├── CollectionTypeItem (General)
            └── CollectionTypeItem (Recyclable)
```

---

## 📏 Detailed Measurements & Spacing

### **Screen Container**
```
Container: SafeAreaView
├── backgroundColor: #F5F7FA (appBackground)
├── flex: 1
└── paddingTop: 0 (status bar handled by SafeAreaView)

ScrollView
├── contentContainerStyle
│   ├── paddingTop: 12px
│   ├── paddingBottom: 32px
│   └── paddingHorizontal: 16px
└── RefreshControl
```

---

### **SECTION 1: Header Card (Teal)**

```
┌─────────────────────────────────────────┐
│ 9:41                                 🔔 │ ← 12px from top
│ ─────────────────────────────────────── │
│                                         │ ← 8px spacing
│ Good Morning, Alex! 🧡                  │ ← 20px font, bold, white
│ Route#12 - Central District            │ ← 14px font, white 90%
│ 🕐 4:19:04 PM                           │ ← 13px font, white 85%
│                                         │ ← 16px spacing
│ 🚛 Route Progress      ⏱ 6% • ETA      │ ← 13px font, white
│ ▓▓▓▓▓░░░░░░░░░░░░░░░░░░░ (8px height)  │ ← Progress bar
│                                         │ ← 16px spacing
│ ┌─────────────────┐ ┌─────────────────┐ │
│ │ ✓               │ │ ↻               │ │ ← Icons 16px
│ │ Completed       │ │ Efficiency      │ │ ← 13px font, white 90%
│ │ 47/72           │ │ 96%             │ │ ← 24px font, bold, white
│ └─────────────────┘ └─────────────────┘ │
│    (Blue #4A90E2)     (Green #52C9A8)   │
└─────────────────────────────────────────┘

Dimensions:
├── Container
│   ├── backgroundColor: #2BA5A0 (headerTeal)
│   ├── borderRadius: 24px
│   ├── padding: 20px
│   ├── marginHorizontal: 16px
│   ├── marginBottom: 20px
│   └── shadow: elevation 5, shadowOpacity 0.15
│
├── Status Bar Row
│   ├── flexDirection: row
│   ├── justifyContent: space-between
│   ├── marginBottom: 8px
│   ├── Time: fontSize 14, color white
│   └── Bell: fontSize 20, touchable
│
├── Greeting Section
│   ├── marginBottom: 16px
│   ├── Greeting: fontSize 20, fontWeight bold, color white
│   ├── Route Info: fontSize 14, color white 90%
│   └── Current Time: fontSize 13, color white 85%
│
├── Progress Section (TouchableOpacity)
│   ├── marginBottom: 16px
│   ├── Label Row
│   │   ├── flexDirection: row
│   │   ├── justifyContent: space-between
│   │   ├── marginBottom: 8px
│   │   └── fontSize: 13px, color white
│   └── ProgressBar
│       ├── height: 8px
│       ├── backgroundColor: white 30%
│       └── fillColor: white
│
└── Header Stats Row
    ├── flexDirection: row
    ├── gap: 12px
    ├── Stat Card (both cards)
    │   ├── flex: 1
    │   ├── backgroundColor: #4A90E2 or #52C9A8
    │   ├── borderRadius: 16px
    │   ├── padding: 16px
    │   ├── Icon: fontSize 16, marginBottom 4px
    │   ├── Label: fontSize 13, color white 90%
    │   └── Value: fontSize 24, fontWeight bold, color white
    └── Total height: ~100px per card
```

---

### **SECTION 2: Impact Section**

```
┌─────────────────────────────────────────┐
│ Today's Impact            🌱 ♻️         │ ← Header
│ ─────────────────────────────────────── │
│                                         │ ← 16px spacing
│   ♻️          💨          🌳           │ ← Icons 32px
│  Recycled    CO² Saved   Trees Saved   │ ← Labels 12px
│  1.2 tons    89 kg       3.2           │ ← Values 18px, bold
│                                         │
└─────────────────────────────────────────┘

Dimensions:
├── Container
│   ├── backgroundColor: #FFFFFF (lightCard)
│   ├── borderRadius: 16px
│   ├── padding: 20px
│   ├── marginHorizontal: 16px
│   ├── marginBottom: 20px
│   └── shadow: elevation 3, shadowOpacity 0.1
│
├── Header Row
│   ├── flexDirection: row
│   ├── justifyContent: space-between
│   ├── alignItems: center
│   ├── marginBottom: 16px
│   ├── Title: fontSize 18, fontWeight bold, color #1F2937
│   └── Icons: fontSize 16
│
└── Impact Cards Row
    ├── flexDirection: row
    ├── gap: 12px
    └── Each ImpactCard
        ├── flex: 1
        ├── alignItems: center
        ├── Icon: fontSize 32, marginBottom 8px
        ├── Value: fontSize 18, fontWeight bold, color #1F2937
        └── Label: fontSize 12, color #6B7280
```

---

### **SECTION 3: Collections Section**

```
┌─────────────────────────────────────────┐
│ Today's Collections by Type             │ ← Title
│ ─────────────────────────────────────── │
│                                         │ ← 16px spacing
│ ┌────┐                                  │
│ │🗑️ │  General              28      ›  │
│ └────┘  Collected today                │
│                                         │ ← 12px spacing
│ ┌────┐                                  │
│ │♻️ │  Recyclable           15      ›  │
│ └────┘  Collected today                │
│                                         │
└─────────────────────────────────────────┘

Dimensions:
├── Container
│   ├── backgroundColor: transparent
│   ├── paddingHorizontal: 16px
│   └── marginBottom: 20px
│
├── Title
│   ├── fontSize: 18px
│   ├── fontWeight: bold
│   ├── color: #1F2937
│   ├── marginBottom: 16px
│   └── backgroundColor: #FFFFFF (in white card)
│
└── Collection Items
    └── Each CollectionTypeItem
        ├── backgroundColor: #FFFFFF
        ├── borderRadius: 16px
        ├── padding: 16px
        ├── marginBottom: 12px
        ├── shadow: elevation 3
        ├── flexDirection: row
        ├── alignItems: center
        │
        ├── Icon Container
        │   ├── width: 48px
        │   ├── height: 48px
        │   ├── borderRadius: 12px
        │   ├── backgroundColor: iconColor + 20% opacity
        │   ├── Icon: fontSize 24
        │   └── marginRight: 12px
        │
        ├── Content (flex: 1)
        │   ├── Type: fontSize 16, fontWeight semiBold
        │   └── Subtitle: fontSize 12, color gray
        │
        ├── Count
        │   ├── fontSize: 24px
        │   ├── fontWeight: bold
        │   └── marginRight: 12px
        │
        └── Arrow
            └── fontSize: 20px, opacity 40%
```

---

## 🎨 Color Palette

### **Background Colors**
```javascript
App Background:          #F5F7FA  (appBackground)
Header Card:             #2BA5A0  (headerTeal)
White Cards:             #FFFFFF  (lightCard)
Completed Stat Card:     #4A90E2  (headerCompletedBlue)
Efficiency Stat Card:    #52C9A8  (headerEfficiencyGreen)
```

### **Text Colors on Teal Background**
```javascript
Primary Text:            #FFFFFF  (100% opacity)
Secondary Text:          #FFFFFF  (90% opacity)
Tertiary Text:           #FFFFFF  (85% opacity)
```

### **Text Colors on White Background**
```javascript
Primary Text:            #1F2937  (primaryDarkTeal)
Secondary Text:          #6B7280  (gray)
```

### **Icon Colors**
```javascript
Recycling Icon:          #10B981  (iconGreen)
CO² Icon:                #6B7280  (iconGray)
Tree Icon:               #10B981  (iconGreen)
General Waste:           #F97316  (iconOrange)
Recyclable:              #14B8A6  (iconTeal)
```

---

## 📱 Responsive Behavior

### **Header Card**
- **Fixed Margins:** 16px horizontal
- **Fluid Width:** Adapts to screen width
- **Fixed Padding:** 20px all around
- **Stat Cards:** Equal flex (1:1 ratio)

### **Impact Cards**
- **Equal Width:** Each card gets flex: 1
- **Gap:** 12px between cards
- **Minimum Width:** ~90px per card
- **Centered:** Icons and text centered

### **Collection Items**
- **Full Width:** Minus 32px (16px margins each side)
- **Fixed Height:** Auto-adjusting based on content
- **Spacing:** 12px between items

---

## 🎯 Interactive Elements

### **1. Notification Bell**
```
Type: TouchableOpacity
Location: Top-right of header card
Action: Opens notifications screen
Visual Feedback: activeOpacity 0.7
```

### **2. Progress Section**
```
Type: TouchableOpacity
Location: Inside header card
Action: Navigate to RouteManagement screen
Visual Feedback: activeOpacity 0.9 (subtle)
```

### **3. Collection Type Items**
```
Type: TouchableOpacity (via CollectionTypeItem)
Location: Collections section
Action: Show collection details for type
Visual Feedback: activeOpacity 0.7
```

### **4. Pull to Refresh**
```
Type: RefreshControl
Location: ScrollView
Action: Reload data from context
Visual: Default iOS/Android spinner
```

---

## 📐 Layout Constraints

### **Minimum Dimensions**
```
Minimum Screen Width:    320px (iPhone SE)
Maximum Content Width:   No limit (responsive)
Header Card Min Height:  ~280px
Impact Section Height:   ~150px
Collection Item Height:  ~80px
```

### **Z-Index Layers**
```
Layer 1 (Base):       App Background (#F5F7FA)
Layer 2 (Cards):      Header Card, White Cards
Layer 3 (Elements):   Stat cards, Impact cards, Collection items
Layer 4 (Overlays):   Notification bell, arrows
```

---

## 🔄 State & Data Flow

### **Time-Based Elements**
```
Status Bar Time:     Real device time
Current Time:        Updates every 1 minute
Greeting:            Based on hour (0-11: Morning, 12-16: Afternoon, etc.)
```

### **Progress Calculation**
```
Percentage:          (completed / total) * 100
ETA:                 currentTime + (remaining × 15 minutes)
Progress Bar Fill:   Percentage value (0-100)
```

### **Data Sources**
```
routeInfo:           From RouteContext
impactMetrics:       From RouteContext
collectionsByType:   From RouteContext
stats:               From getStatistics()
```

---

## 🎭 Animation & Transitions

### **On Load**
```
Header Card:         Fade in + Slide from top (300ms)
Impact Section:      Fade in (400ms, delay 100ms)
Collections:         Fade in (400ms, delay 200ms)
```

### **On Refresh**
```
Pull to Refresh:     Default platform animation
Content Update:      Smooth fade (200ms)
```

### **On Navigation**
```
Route Management:    Push animation (default)
```

### **Hover/Press States**
```
Notification Bell:   Scale 0.95 on press
Progress Section:    Opacity 0.9 on press
Collection Items:    Scale 0.98 on press
```

---

## 🧪 Test Points (testID Mapping)

```javascript
// Header Card
'header-card'                    → Main teal container
'status-bar-time'                → Device time display
'notification-bell'              → Bell icon button
'current-time'                   → Current time with icon
'progress-section-touchable'     → Clickable progress area
'header-stats-row'               → Container for stat cards
'header-stat-completed'          → Blue completed card
'header-stat-efficiency'         → Green efficiency card
'completed-icon'                 → Checkmark icon
'efficiency-icon'                → Efficiency icon

// Main Container
'dashboard-container'            → SafeAreaView
'dashboard-scroll-view'          → ScrollView

// Impact Section
'impact-section'                 → White card container
'impact-header-icons'            → Icons next to title

// Auto-generated from components
'progress-bar-container'         → From ProgressBar component
'impact-card-recycled'           → From ImpactCard component
'collection-type-item-general'   → From CollectionTypeItem
```

---

## 📋 Implementation Checklist

### **Phase 1: Structure**
- [ ] Update SafeAreaView with light background
- [ ] Add ScrollView with RefreshControl
- [ ] Create header card container (teal)
- [ ] Add testIDs to all elements

### **Phase 2: Header Card**
- [ ] Status bar with time and bell
- [ ] Greeting section with emoji
- [ ] Route info display
- [ ] Current time with clock icon
- [ ] Progress section (touchable)
- [ ] Two stat cards (blue/green)

### **Phase 3: Impact Section**
- [ ] White card container
- [ ] Title with icons
- [ ] Three ImpactCard components
- [ ] Proper spacing and layout

### **Phase 4: Collections Section**
- [ ] Title
- [ ] CollectionTypeItem components
- [ ] Map through collectionsByType

### **Phase 5: Interactions**
- [ ] Notification bell handler
- [ ] Progress section navigation
- [ ] Pull to refresh handler
- [ ] Time update useEffect

### **Phase 6: Styling**
- [ ] Apply all colors correctly
- [ ] Match spacing/padding
- [ ] Add shadows/elevation
- [ ] Test on different screen sizes

---

## 🎯 Success Criteria

✅ Visual match with screenshot (95%+)  
✅ All testIDs present  
✅ All 64 tests passing  
✅ Smooth interactions  
✅ Proper navigation  
✅ Time updates correctly  
✅ Pull-to-refresh works  
✅ No console warnings  
✅ Responsive on all screen sizes  

---

## 📱 Screen Sizes to Test

```
iPhone SE (1st gen):     320 × 568 pt
iPhone 8:                375 × 667 pt
iPhone 12/13/14:         390 × 844 pt
iPhone 12/13/14 Pro Max: 428 × 926 pt
Android (Small):         360 × 640 dp
Android (Medium):        412 × 732 dp
Android (Large):         428 × 926 dp
```

---

**Mockup Complete! Ready for implementation.** 🎨

---

*Created: Oct 16, 2025, 10:22 PM IST*  
*Estimated Implementation Time: 90-120 minutes*  
*Complexity: Medium-High*
