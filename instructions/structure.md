## 🧑‍🍳 Personal Recipe App – Design Requirements

### 🎯 Purpose

An app to help one person:

* Store and categorize personal recipes
* Get smart recommendations based on ingredients left in the fridge
* Easily plan shopping with auto-generated lists
* Import recipes quickly with OCR
* Browse based on mood, ease, cooking time, or occasion

---

## 🔑 Core Features

### 1. **Home Dashboard**

* Search bar (recipe name or ingredient)
* Quick filters:

  * Easy to Cook
  * Cooking Time (short, medium, long)
  * Weather Match (e.g. Cold Day, Hot Day, Rainy)
  * Occasion (e.g. Party, Quick Lunch, Date Night)
* “Fridge Suggestions” (recipes based on current ingredients)

---

### 2. **Recipe Storage & Detail**

Each recipe should include:

* Title
* Image (optional)
* Description / Story / Notes
* Ingredients (with quantity)
* Steps (step-by-step format)
* Tags:

  * Cuisine (Vietnamese, Italian, etc.)
  * Taste (Spicy, Sweet, etc.)
  * Difficulty
  * Cooking Time
  * Occasion (Picnic, Winter, etc.)

**Actions on recipe screen:**

* Edit / Delete
* Add to Shopping List
* Cook Now (step-by-step mode)
* Duplicate or create version

---

### 3. **Add Recipe Flow**

* Manual entry with fields:

  * Title, Description
  * Ingredients list (with unit and quantity)
  * Steps (with optional images)
  * Tags (from above)
* **Optional OCR Scan**

  * Scan printed or handwritten recipe to auto-fill fields
  * Edit after OCR before saving

---

### 4. **Categorization & Sorting**

* Categories:

  * Custom cuisine types
  * Occasion types
  * Mood or season (e.g. cozy, refreshing)
* Sorting Options:

  * By cooking time
  * By difficulty
  * Alphabetical
  * Recently added

---

### 5. **Fridge Mode (Ingredient-Based Suggestions)**

* User adds what they have in fridge/pantry
* App shows recipes:

  * Exact matches
  * Partial matches (with “missing X ingredients” warning)

---

### 6. **Shopping List**

* Create from selected recipe(s)
* Allow custom edits: add/remove items
* Checkbox to mark items as bought
* Save shopping list history (optional)

---

## 📱 UI Screens Required

1. **Splash / App Intro**
2. **Home Dashboard**
3. **Recipe List + Filters**
4. **Recipe Detail**
5. **Add/Edit Recipe**
6. **OCR Recipe Import**
7. **Fridge Ingredients Entry**
8. **Suggested Recipes (from fridge)**
9. **Shopping List (generate & edit)**

---