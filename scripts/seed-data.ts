export type SeedExercise = {
  name: string;
  target: string;
  secondaryMuscles: string[];
  equipment: string;
  searchQueries: string[]; // for matching against ExerciseDB
};

export const TARGET_EXERCISES: SeedExercise[] = [
  // --- CHEST ---
  // Barbell
  { name: "Barbell Bench Press", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Barbell", searchQueries: ["barbell bench press"] },
  { name: "Incline Barbell Bench Press", target: "Upper Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Barbell", searchQueries: ["barbell incline bench press", "incline barbell bench press"] },
  { name: "Decline Barbell Bench Press", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Barbell", searchQueries: ["barbell decline bench press"] },
  { name: "Close-Grip Barbell Bench Press", target: "Triceps", secondaryMuscles: ["Chest", "Front Delts"], equipment: "Barbell", searchQueries: ["barbell close-grip bench press"] },
  { name: "Wide-Grip Barbell Bench Press", target: "Chest", secondaryMuscles: ["Front Delts"], equipment: "Barbell", searchQueries: ["barbell wide-grip bench press"] },
  
  // Dumbbell
  { name: "Dumbbell Bench Press", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell bench press", "dumbbell press"] },
  { name: "Incline Dumbbell Press", target: "Upper Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell incline bench press", "incline dumbbell press"] },
  { name: "Decline Dumbbell Press", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell decline bench press"] },
  { name: "Dumbbell Floor Press", target: "Chest", secondaryMuscles: ["Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell floor press"] },
  { name: "Dumbbell Squeeze Press", target: "Chest", secondaryMuscles: ["Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell squeeze press", "dumbbell hex press"] },
  { name: "Neutral-Grip Dumbbell Bench Press", target: "Chest", secondaryMuscles: ["Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell neutral grip bench press"] },
  { name: "Neutral-Grip Incline Dumbbell Press", target: "Upper Chest", secondaryMuscles: ["Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell incline neutral grip press"] },
  { name: "Dumbbell Fly", target: "Chest", secondaryMuscles: ["Front Delts"], equipment: "Dumbbell", searchQueries: ["dumbbell fly"] },
  { name: "Incline Dumbbell Fly", target: "Upper Chest", secondaryMuscles: ["Front Delts"], equipment: "Dumbbell", searchQueries: ["dumbbell incline fly"] },
  { name: "Decline Dumbbell Fly", target: "Chest", secondaryMuscles: ["Front Delts"], equipment: "Dumbbell", searchQueries: ["dumbbell decline fly"] },

  // Cable
  { name: "Cable Chest Fly", target: "Chest", secondaryMuscles: ["Front Delts"], equipment: "Cable", searchQueries: ["cable fly", "cable standing fly"] },
  { name: "Low-to-High Cable Fly", target: "Upper Chest", secondaryMuscles: ["Front Delts"], equipment: "Cable", searchQueries: ["cable low fly", "low to high cable fly"] },
  { name: "High-to-Low Cable Fly", target: "Chest", secondaryMuscles: ["Front Delts"], equipment: "Cable", searchQueries: ["cable high fly", "high to low cable fly"] },
  { name: "Standing Cable Chest Press", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Cable", searchQueries: ["cable chest press", "cable standing chest press"] },
  { name: "Single-Arm Cable Chest Press", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Cable", searchQueries: ["cable one arm chest press"] },
  { name: "Cable Crossover", target: "Chest", secondaryMuscles: ["Front Delts"], equipment: "Cable", searchQueries: ["cable cross-over", "cable crossover"] },

  // Machine
  { name: "Machine Chest Press", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Machine", searchQueries: ["machine chest press", "lever chest press"] },
  { name: "Incline Machine Chest Press", target: "Upper Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Machine", searchQueries: ["machine incline chest press", "lever incline chest press"] },
  { name: "Decline Machine Chest Press", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Machine", searchQueries: ["machine decline chest press", "lever decline chest press"] },
  { name: "Pec Deck", target: "Chest", secondaryMuscles: ["Front Delts"], equipment: "Machine", searchQueries: ["pec deck", "lever pec deck fly"] },
  { name: "Machine Chest Fly", target: "Chest", secondaryMuscles: ["Front Delts"], equipment: "Machine", searchQueries: ["machine fly", "lever seated fly"] },

  // Smith Machine
  { name: "Smith Machine Bench Press", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Smith Machine", searchQueries: ["smith bench press"] },
  { name: "Smith Machine Incline Bench Press", target: "Upper Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Smith Machine", searchQueries: ["smith incline bench press"] },
  { name: "Smith Machine Decline Bench Press", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Smith Machine", searchQueries: ["smith decline bench press"] },

  // Bodyweight
  { name: "Push-Up", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps", "Core"], equipment: "Bodyweight", searchQueries: ["push-up", "push up"] },
  { name: "Wide Push-Up", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps", "Core"], equipment: "Bodyweight", searchQueries: ["wide push-up"] },
  { name: "Close-Grip Push-Up", target: "Triceps", secondaryMuscles: ["Chest", "Front Delts", "Core"], equipment: "Bodyweight", searchQueries: ["close-grip push-up", "diamond push-up"] },
  { name: "Decline Push-Up", target: "Upper Chest", secondaryMuscles: ["Front Delts", "Triceps", "Core"], equipment: "Bodyweight", searchQueries: ["decline push-up"] },
  { name: "Incline Push-Up", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps", "Core"], equipment: "Bodyweight", searchQueries: ["incline push-up"] },
  { name: "Chest Dip", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Bodyweight", searchQueries: ["chest dip"] },
  { name: "Weighted Dip", target: "Chest", secondaryMuscles: ["Front Delts", "Triceps"], equipment: "Weighted", searchQueries: ["weighted tricep dip", "weighted dip"] },

  // --- SHOULDERS ---
  // Dumbbell
  { name: "Dumbbell Shoulder Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell shoulder press"] },
  { name: "Seated Dumbbell Shoulder Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell seated shoulder press"] },
  { name: "Standing Dumbbell Shoulder Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell standing shoulder press"] },
  { name: "Arnold Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell arnold press"] },
  { name: "Dumbbell Lateral Raise", target: "Lateral Delts", secondaryMuscles: ["Front Delts", "Traps"], equipment: "Dumbbell", searchQueries: ["dumbbell lateral raise"] },
  { name: "Seated Dumbbell Lateral Raise", target: "Lateral Delts", secondaryMuscles: ["Front Delts", "Traps"], equipment: "Dumbbell", searchQueries: ["dumbbell seated lateral raise"] },
  { name: "Incline Dumbbell Lateral Raise", target: "Lateral Delts", secondaryMuscles: ["Front Delts", "Traps"], equipment: "Dumbbell", searchQueries: ["dumbbell incline lateral raise"] },
  { name: "Dumbbell Front Raise", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Traps"], equipment: "Dumbbell", searchQueries: ["dumbbell front raise"] },
  { name: "Alternating Dumbbell Front Raise", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Traps"], equipment: "Dumbbell", searchQueries: ["dumbbell alternate front raise"] },
  { name: "Dumbbell Rear Delt Raise", target: "Rear Delts", secondaryMuscles: ["Traps", "Upper Back"], equipment: "Dumbbell", searchQueries: ["dumbbell rear delt raise", "dumbbell rear lateral raise"] },
  { name: "Incline Dumbbell Rear-Delt Raise", target: "Rear Delts", secondaryMuscles: ["Traps", "Upper Back"], equipment: "Dumbbell", searchQueries: ["dumbbell incline rear delt raise", "chest supported dumbbell rear delt raise"] },
  
  // Cable
  { name: "Cable Lateral Raise", target: "Lateral Delts", secondaryMuscles: ["Front Delts", "Traps"], equipment: "Cable", searchQueries: ["cable lateral raise", "cable standing lateral raise"] },
  { name: "Single-Arm Cable Lateral Raise", target: "Lateral Delts", secondaryMuscles: ["Front Delts", "Traps"], equipment: "Cable", searchQueries: ["cable one arm lateral raise"] },
  { name: "Behind-the-Back Cable Lateral Raise", target: "Lateral Delts", secondaryMuscles: ["Front Delts", "Traps"], equipment: "Cable", searchQueries: ["cable rear drive", "cable behind back lateral raise"] },
  { name: "Cable Front Raise", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Traps"], equipment: "Cable", searchQueries: ["cable front raise"] },
  { name: "Single-Arm Cable Front Raise", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Traps"], equipment: "Cable", searchQueries: ["cable one arm front raise"] },
  { name: "Cable Rear Delt Fly", target: "Rear Delts", secondaryMuscles: ["Traps", "Upper Back"], equipment: "Cable", searchQueries: ["cable rear delt fly", "cable reverse fly"] },
  { name: "Single-Arm Cable Rear Delt Fly", target: "Rear Delts", secondaryMuscles: ["Traps", "Upper Back"], equipment: "Cable", searchQueries: ["cable one arm rear delt fly"] },
  { name: "Cable Face Pull", target: "Rear Delts", secondaryMuscles: ["Traps", "Upper Back"], equipment: "Cable", searchQueries: ["cable face pull"] },
  { name: "Cable Y Raise", target: "Lateral Delts", secondaryMuscles: ["Front Delts", "Traps"], equipment: "Cable", searchQueries: ["cable y-raise"] },

  // Machine
  { name: "Machine Shoulder Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps"], equipment: "Machine", searchQueries: ["machine shoulder press", "lever shoulder press"] },
  { name: "Machine Lateral Raise", target: "Lateral Delts", secondaryMuscles: ["Front Delts", "Traps"], equipment: "Machine", searchQueries: ["machine lateral raise", "lever lateral raise"] },
  { name: "Machine Rear Delt Fly", target: "Rear Delts", secondaryMuscles: ["Traps", "Upper Back"], equipment: "Machine", searchQueries: ["machine rear delt fly", "lever reverse fly", "machine reverse fly"] },
  { name: "Machine Front Raise", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Traps"], equipment: "Machine", searchQueries: ["machine front raise", "lever front raise"] },

  // Barbell
  { name: "Barbell Overhead Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps"], equipment: "Barbell", searchQueries: ["barbell standing military press", "barbell overhead press"] },
  { name: "Seated Barbell Overhead Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps"], equipment: "Barbell", searchQueries: ["barbell seated military press", "barbell seated overhead press"] },
  { name: "Behind-the-Neck Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps"], equipment: "Barbell", searchQueries: ["barbell seated behind head military press"] },
  { name: "Push Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps", "Legs"], equipment: "Barbell", searchQueries: ["barbell push press"] },

  // Smith Machine
  { name: "Smith Machine Shoulder Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps"], equipment: "Smith Machine", searchQueries: ["smith shoulder press", "smith seated shoulder press"] },
  { name: "Smith Machine Behind-the-Neck Press", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps"], equipment: "Smith Machine", searchQueries: ["smith behind neck press"] },

  // Other
  { name: "Pike Push-Up", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps", "Core"], equipment: "Bodyweight", searchQueries: ["pike push-up"] },
  { name: "Handstand Push-Up", target: "Front Delts", secondaryMuscles: ["Lateral Delts", "Triceps", "Core"], equipment: "Bodyweight", searchQueries: ["handstand push-up"] },
  { name: "Plate Front Raise", target: "Front Delts", secondaryMuscles: ["Lateral Delts"], equipment: "Weight Plate", searchQueries: ["plate front raise"] },
  { name: "Plate Lateral Raise", target: "Lateral Delts", secondaryMuscles: ["Front Delts"], equipment: "Weight Plate", searchQueries: ["plate lateral raise"] },

  // --- BACK / LATS ---
  // Vertical Pulling
  { name: "Lat Pulldown", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Cable", searchQueries: ["cable pulldown", "lat pulldown"] },
  { name: "Wide-Grip Lat Pulldown", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Cable", searchQueries: ["cable wide-grip pulldown", "cable rear pulldown"] },
  { name: "Close-Grip Lat Pulldown", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Cable", searchQueries: ["cable close-grip pulldown", "cable v-bar pulldown"] },
  { name: "Neutral-Grip Lat Pulldown", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Cable", searchQueries: ["cable neutral-grip pulldown"] },
  { name: "Underhand Lat Pulldown", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Cable", searchQueries: ["cable underhand pulldown"] },
  { name: "Single-Arm Lat Pulldown", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Cable", searchQueries: ["cable one arm pulldown"] },
  { name: "Behind-the-Neck Lat Pulldown", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Cable", searchQueries: ["cable rear pulldown"] },
  { name: "Straight-Arm Pulldown", target: "Lats", secondaryMuscles: ["Triceps", "Core"], equipment: "Cable", searchQueries: ["cable straight-arm pulldown", "cable straight arm pulldown"] },
  { name: "Single-Arm Straight-Arm Pulldown", target: "Lats", secondaryMuscles: ["Triceps", "Core"], equipment: "Cable", searchQueries: ["cable one arm straight-arm pulldown"] },
  { name: "Pull-Up", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Bodyweight", searchQueries: ["pull-up", "pull up"] },
  { name: "Wide-Grip Pull-Up", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Bodyweight", searchQueries: ["wide-grip pull-up"] },
  { name: "Close-Grip Pull-Up", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Bodyweight", searchQueries: ["close-grip pull-up"] },
  { name: "Neutral-Grip Pull-Up", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Bodyweight", searchQueries: ["pull up (neutral grip)"] },
  { name: "Chin-Up", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Bodyweight", searchQueries: ["chin-up", "chin up"] },
  { name: "Weighted Pull-Up", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Weighted", searchQueries: ["weighted pull-up"] },
  { name: "Weighted Chin-Up", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Weighted", searchQueries: ["weighted chin-up"] },

  // Cable Rows
  { name: "Seated Cable Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Cable", searchQueries: ["cable seated row"] },
  { name: "Close-Grip Cable Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Cable", searchQueries: ["cable seated row (v-bar)", "cable close-grip seated row"] },
  { name: "Wide-Grip Cable Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Cable", searchQueries: ["cable seated wide-grip row"] },
  { name: "Neutral-Grip Cable Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Cable", searchQueries: ["cable neutral-grip row"] },
  { name: "Single-Arm Cable Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Cable", searchQueries: ["cable one arm seated row"] },
  { name: "Single-Arm Kneeling Cable Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Cable", searchQueries: ["cable one arm kneeling row"] },
  { name: "Chest-Supported Cable Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Cable", searchQueries: ["cable chest supported row"] },
  { name: "Cable High Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Cable", searchQueries: ["cable high row"] },
  { name: "Cable Low Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Cable", searchQueries: ["cable low row"] },

  // Dumbbell
  { name: "One-Arm Dumbbell Row", target: "Lats", secondaryMuscles: ["Upper Back", "Biceps", "Rear Delts"], equipment: "Dumbbell", searchQueries: ["dumbbell bent-over row", "dumbbell one arm row"] },
  { name: "Chest-Supported Dumbbell Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Dumbbell", searchQueries: ["dumbbell incline row", "dumbbell chest supported row"] },
  { name: "Dumbbell Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Dumbbell", searchQueries: ["dumbbell bent-over row (two arms)"] },
  { name: "Incline Dumbbell Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Dumbbell", searchQueries: ["dumbbell incline row"] },
  { name: "Dumbbell Pullover", target: "Lats", secondaryMuscles: ["Chest", "Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell pullover"] },
  { name: "Incline Dumbbell Pullover", target: "Lats", secondaryMuscles: ["Chest", "Triceps"], equipment: "Dumbbell", searchQueries: ["dumbbell incline pullover"] },

  // Barbell
  { name: "Barbell Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts", "Lower Back"], equipment: "Barbell", searchQueries: ["barbell bent over row"] },
  { name: "Pendlay Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts", "Lower Back"], equipment: "Barbell", searchQueries: ["barbell pendlay row"] },
  { name: "Yates Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts", "Lower Back"], equipment: "Barbell", searchQueries: ["barbell yates row"] },
  { name: "Underhand Barbell Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts", "Lower Back"], equipment: "Barbell", searchQueries: ["barbell reverse grip bent over row"] },
  { name: "T-Bar Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts", "Lower Back"], equipment: "Barbell", searchQueries: ["barbell t-bar row", "lever t-bar row"] },

  // Machine
  { name: "Machine Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Machine", searchQueries: ["machine row", "lever seated row"] },
  { name: "Chest-Supported Machine Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Machine", searchQueries: ["lever front pulldown"] },
  { name: "Iso-Lateral Row", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Machine", searchQueries: ["lever iso-lateral row"] },
  { name: "High Row Machine", target: "Upper Back", secondaryMuscles: ["Lats", "Biceps", "Rear Delts"], equipment: "Machine", searchQueries: ["lever high row"] },
  { name: "Lat Pulldown Machine", target: "Lats", secondaryMuscles: ["Biceps", "Rear Delts", "Upper Back"], equipment: "Machine", searchQueries: ["lever pulldown", "machine lat pulldown"] },

  // --- TRAPS / UPPER BACK ---
  { name: "Barbell Shrug", target: "Traps", secondaryMuscles: ["Upper Back"], equipment: "Barbell", searchQueries: ["barbell shrug"] },
  { name: "Dumbbell Shrug", target: "Traps", secondaryMuscles: ["Upper Back"], equipment: "Dumbbell", searchQueries: ["dumbbell shrug"] },
  { name: "Cable Shrug", target: "Traps", secondaryMuscles: ["Upper Back"], equipment: "Cable", searchQueries: ["cable shrug"] },
  { name: "Smith Machine Shrug", target: "Traps", secondaryMuscles: ["Upper Back"], equipment: "Smith Machine", searchQueries: ["smith shrug"] },
  { name: "Behind-the-Back Barbell Shrug", target: "Traps", secondaryMuscles: ["Upper Back"], equipment: "Barbell", searchQueries: ["barbell behind back shrug"] },
  { name: "Machine Shrug", target: "Traps", secondaryMuscles: ["Upper Back"], equipment: "Machine", searchQueries: ["lever shrug", "machine shrug"] },
  { name: "Farmer's Walk", target: "Traps", secondaryMuscles: ["Upper Back", "Core", "Forearms"], equipment: "Kettlebell", searchQueries: ["farmer's walk"] },
  { name: "Dumbbell Farmer's Carry", target: "Traps", secondaryMuscles: ["Upper Back", "Core", "Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell farmer's carry"] },
  { name: "Barbell Upright Row", target: "Traps", secondaryMuscles: ["Lateral Delts", "Upper Back", "Biceps"], equipment: "Barbell", searchQueries: ["barbell upright row"] },
  { name: "Dumbbell Upright Row", target: "Traps", secondaryMuscles: ["Lateral Delts", "Upper Back", "Biceps"], equipment: "Dumbbell", searchQueries: ["dumbbell upright row"] },
  { name: "Cable Upright Row", target: "Traps", secondaryMuscles: ["Lateral Delts", "Upper Back", "Biceps"], equipment: "Cable", searchQueries: ["cable upright row"] },
  { name: "Face Pull", target: "Rear Delts", secondaryMuscles: ["Traps", "Upper Back"], equipment: "Cable", searchQueries: ["rope face pull"] },
  { name: "Chest-Supported Rear Delt Row", target: "Rear Delts", secondaryMuscles: ["Traps", "Upper Back"], equipment: "Dumbbell", searchQueries: ["dumbbell incline rear delt row"] },

  // --- BICEPS ---
  // Dumbbell
  { name: "Dumbbell Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell curl"] },
  { name: "Alternating Dumbbell Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell alternate bicep curl"] },
  { name: "Dumbbell Supinating Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell supinating curl", "dumbbell alternating curl"] },
  { name: "Hammer Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell hammer curl"] },
  { name: "Cross-Body Hammer Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell cross body hammer curl"] },
  { name: "Incline Dumbbell Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell incline curl"] },
  { name: "Concentration Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell concentration curl"] },
  { name: "Seated Dumbbell Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell seated curl"] },
  { name: "Spider Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell spider curl"] },
  { name: "Zottman Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell zottman curl"] },
  { name: "Drag Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Dumbbell", searchQueries: ["dumbbell drag curl"] },

  // Barbell
  { name: "Barbell Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Barbell", searchQueries: ["barbell curl"] },
  { name: "Wide-Grip Barbell Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Barbell", searchQueries: ["barbell wide-grip curl"] },
  { name: "Close-Grip Barbell Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Barbell", searchQueries: ["barbell close-grip curl"] },
  { name: "Reverse Barbell Curl", target: "Forearms", secondaryMuscles: ["Biceps"], equipment: "Barbell", searchQueries: ["barbell reverse curl"] },
  { name: "Drag Barbell Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Barbell", searchQueries: ["barbell drag curl"] },

  // EZ Bar
  { name: "EZ-Bar Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "EZ Bar", searchQueries: ["ez barbell curl"] },
  { name: "EZ-Bar Preacher Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "EZ Bar", searchQueries: ["ez barbell preacher curl"] },
  { name: "Reverse EZ-Bar Curl", target: "Forearms", secondaryMuscles: ["Biceps"], equipment: "EZ Bar", searchQueries: ["ez barbell reverse curl"] },
  { name: "Close-Grip EZ-Bar Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "EZ Bar", searchQueries: ["ez barbell close-grip curl"] },
  { name: "Wide-Grip EZ-Bar Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "EZ Bar", searchQueries: ["ez barbell wide-grip curl"] },

  // Cable
  { name: "Cable Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Cable", searchQueries: ["cable curl", "cable standing curl"] },
  { name: "Single-Arm Cable Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Cable", searchQueries: ["cable one arm curl"] },
  { name: "Bayesian Cable Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Cable", searchQueries: ["cable bayesian curl", "cable seated curl"] },
  { name: "Cable Hammer Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Cable", searchQueries: ["cable hammer curl"] },
  { name: "Rope Cable Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Cable", searchQueries: ["cable rope curl"] },
  { name: "Reverse Cable Curl", target: "Forearms", secondaryMuscles: ["Biceps"], equipment: "Cable", searchQueries: ["cable reverse curl"] },
  { name: "High Cable Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Cable", searchQueries: ["cable high curl"] },

  // Machine
  { name: "Machine Biceps Curl", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Machine", searchQueries: ["machine bicep curl", "lever bicep curl"] },
  { name: "Preacher Curl Machine", target: "Biceps", secondaryMuscles: ["Forearms"], equipment: "Machine", searchQueries: ["lever preacher curl", "machine preacher curl"] },

  // --- TRICEPS ---
  // Dumbbell
  { name: "Overhead Dumbbell Triceps Extension", target: "Triceps", secondaryMuscles: [], equipment: "Dumbbell", searchQueries: ["dumbbell standing triceps extension", "dumbbell seated triceps extension"] },
  { name: "Single-Arm Overhead Dumbbell Extension", target: "Triceps", secondaryMuscles: [], equipment: "Dumbbell", searchQueries: ["dumbbell one arm triceps extension"] },
  { name: "Dumbbell Skull Crushers", target: "Triceps", secondaryMuscles: [], equipment: "Dumbbell", searchQueries: ["dumbbell lying triceps extension", "dumbbell skull crusher"] },
  { name: "Dumbbell Triceps Kickback", target: "Triceps", secondaryMuscles: [], equipment: "Dumbbell", searchQueries: ["dumbbell kickback"] },
  { name: "Single-Arm Dumbbell Kickback", target: "Triceps", secondaryMuscles: [], equipment: "Dumbbell", searchQueries: ["dumbbell one arm kickback"] },
  { name: "Dumbbell Tate Press", target: "Triceps", secondaryMuscles: [], equipment: "Dumbbell", searchQueries: ["dumbbell tate press"] },
  { name: "Close-Grip Dumbbell Press", target: "Triceps", secondaryMuscles: ["Chest", "Front Delts"], equipment: "Dumbbell", searchQueries: ["dumbbell close-grip press"] },

  // Barbell
  { name: "Barbell Skull Crushers", target: "Triceps", secondaryMuscles: [], equipment: "Barbell", searchQueries: ["barbell lying triceps extension", "barbell skull crusher"] },
  { name: "Close-Grip Bench Press", target: "Triceps", secondaryMuscles: ["Chest", "Front Delts"], equipment: "Barbell", searchQueries: ["barbell close-grip bench press"] },
  { name: "JM Press", target: "Triceps", secondaryMuscles: ["Chest", "Front Delts"], equipment: "Barbell", searchQueries: ["barbell jm press"] },
  { name: "Barbell Overhead Triceps Extension", target: "Triceps", secondaryMuscles: [], equipment: "Barbell", searchQueries: ["barbell standing triceps extension"] },

  // EZ Bar
  { name: "EZ-Bar Skull Crushers", target: "Triceps", secondaryMuscles: [], equipment: "EZ Bar", searchQueries: ["ez barbell lying triceps extension"] },
  { name: "EZ-Bar Overhead Extension", target: "Triceps", secondaryMuscles: [], equipment: "EZ Bar", searchQueries: ["ez barbell standing triceps extension"] },
  { name: "Close-Grip EZ-Bar Press", target: "Triceps", secondaryMuscles: ["Chest", "Front Delts"], equipment: "EZ Bar", searchQueries: ["ez barbell close-grip bench press"] },

  // Cable
  { name: "Cable Triceps Pushdown", target: "Triceps", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable triceps pushdown"] },
  { name: "Rope Triceps Pushdown", target: "Triceps", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable rope pushdown", "rope pushdown"] },
  { name: "Straight-Bar Pushdown", target: "Triceps", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable straight bar pushdown"] },
  { name: "V-Bar Pushdown", target: "Triceps", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable v-bar pushdown"] },
  { name: "Single-Arm Cable Pushdown", target: "Triceps", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable one arm pushdown"] },
  { name: "Reverse-Grip Cable Pushdown", target: "Triceps", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable reverse grip triceps pushdown"] },
  { name: "Overhead Cable Triceps Extension", target: "Triceps", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable overhead triceps extension"] },
  { name: "Single-Arm Overhead Cable Extension", target: "Triceps", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable one arm overhead triceps extension"] },
  { name: "Cable Kickback", target: "Triceps", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable triceps kickback"] },
  { name: "Cross-Body Cable Triceps Extension", target: "Triceps", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable cross body triceps extension"] },

  // Machine / Bodyweight
  { name: "Triceps Dip", target: "Triceps", secondaryMuscles: ["Chest", "Front Delts"], equipment: "Bodyweight", searchQueries: ["triceps dip", "dip"] },
  { name: "Assisted Triceps Dip", target: "Triceps", secondaryMuscles: ["Chest", "Front Delts"], equipment: "Machine", searchQueries: ["assisted triceps dip"] },
  { name: "Machine Triceps Extension", target: "Triceps", secondaryMuscles: [], equipment: "Machine", searchQueries: ["lever triceps extension", "machine triceps extension"] },
  { name: "Bench Dip", target: "Triceps", secondaryMuscles: ["Chest", "Front Delts"], equipment: "Bodyweight", searchQueries: ["bench dip"] },
  { name: "Weighted Bench Dip", target: "Triceps", secondaryMuscles: ["Chest", "Front Delts"], equipment: "Weighted", searchQueries: ["weighted bench dip"] },

  // --- LEGS ---
  // Quadriceps
  { name: "Barbell Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings", "Core"], equipment: "Barbell", searchQueries: ["barbell squat"] },
  { name: "High-Bar Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings", "Core"], equipment: "Barbell", searchQueries: ["barbell high-bar squat", "barbell squat"] },
  { name: "Low-Bar Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings", "Core"], equipment: "Barbell", searchQueries: ["barbell low-bar squat"] },
  { name: "Front Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Core"], equipment: "Barbell", searchQueries: ["barbell front squat"] },
  { name: "Dumbbell Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings", "Core"], equipment: "Dumbbell", searchQueries: ["dumbbell squat"] },
  { name: "Goblet Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Core"], equipment: "Kettlebell", searchQueries: ["kettlebell goblet squat", "dumbbell goblet squat"] },
  { name: "Smith Machine Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Smith Machine", searchQueries: ["smith squat"] },
  { name: "Hack Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Machine", searchQueries: ["hack squat"] },
  { name: "Machine Hack Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Machine", searchQueries: ["lever hack squat"] },
  { name: "Leg Press", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Leg Press Machine", searchQueries: ["leg press"] },
  { name: "Single-Leg Leg Press", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Leg Press Machine", searchQueries: ["single-leg press", "one leg press"] },
  { name: "Narrow-Stance Leg Press", target: "Quadriceps", secondaryMuscles: ["Glutes"], equipment: "Leg Press Machine", searchQueries: ["narrow stance leg press"] },
  { name: "Wide-Stance Leg Press", target: "Quadriceps", secondaryMuscles: ["Glutes", "Adductors"], equipment: "Leg Press Machine", searchQueries: ["wide stance leg press"] },
  { name: "Leg Extension", target: "Quadriceps", secondaryMuscles: [], equipment: "Machine", searchQueries: ["leg extension", "lever leg extension"] },
  { name: "Single-Leg Leg Extension", target: "Quadriceps", secondaryMuscles: [], equipment: "Machine", searchQueries: ["single leg extension"] },
  { name: "Bulgarian Split Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Bodyweight", searchQueries: ["bulgarian split squat"] },
  { name: "Dumbbell Bulgarian Split Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Dumbbell", searchQueries: ["dumbbell bulgarian split squat"] },
  { name: "Smith Machine Bulgarian Split Squat", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Smith Machine", searchQueries: ["smith split squat"] },
  { name: "Walking Lunges", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Bodyweight", searchQueries: ["walking lunge"] },
  { name: "Dumbbell Walking Lunges", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Dumbbell", searchQueries: ["dumbbell walking lunge"] },
  { name: "Barbell Walking Lunges", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Barbell", searchQueries: ["barbell walking lunge"] },
  { name: "Reverse Lunges", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Bodyweight", searchQueries: ["reverse lunge"] },
  { name: "Dumbbell Reverse Lunges", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Dumbbell", searchQueries: ["dumbbell reverse lunge"] },
  { name: "Forward Lunges", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Bodyweight", searchQueries: ["lunge"] },
  { name: "Dumbbell Lunges", target: "Quadriceps", secondaryMuscles: ["Glutes", "Hamstrings"], equipment: "Dumbbell", searchQueries: ["dumbbell lunge"] },
  { name: "Step-Up", target: "Quadriceps", secondaryMuscles: ["Glutes"], equipment: "Bodyweight", searchQueries: ["step-up"] },
  { name: "Dumbbell Step-Up", target: "Quadriceps", secondaryMuscles: ["Glutes"], equipment: "Dumbbell", searchQueries: ["dumbbell step-up"] },

  // Hamstrings
  { name: "Barbell Romanian Deadlift", target: "Hamstrings", secondaryMuscles: ["Glutes", "Lower Back"], equipment: "Barbell", searchQueries: ["barbell romanian deadlift", "barbell rdl"] },
  { name: "Dumbbell Romanian Deadlift", target: "Hamstrings", secondaryMuscles: ["Glutes", "Lower Back"], equipment: "Dumbbell", searchQueries: ["dumbbell romanian deadlift", "dumbbell rdl"] },
  { name: "Single-Leg Dumbbell Romanian Deadlift", target: "Hamstrings", secondaryMuscles: ["Glutes", "Lower Back"], equipment: "Dumbbell", searchQueries: ["dumbbell single leg deadlift"] },
  { name: "Stiff-Leg Deadlift", target: "Hamstrings", secondaryMuscles: ["Glutes", "Lower Back"], equipment: "Bodyweight", searchQueries: ["stiff leg deadlift"] },
  { name: "Barbell Stiff-Leg Deadlift", target: "Hamstrings", secondaryMuscles: ["Glutes", "Lower Back"], equipment: "Barbell", searchQueries: ["barbell stiff leg deadlift"] },
  { name: "Dumbbell Stiff-Leg Deadlift", target: "Hamstrings", secondaryMuscles: ["Glutes", "Lower Back"], equipment: "Dumbbell", searchQueries: ["dumbbell stiff leg deadlift"] },
  { name: "Leg Curl", target: "Hamstrings", secondaryMuscles: ["Calves"], equipment: "Machine", searchQueries: ["leg curl", "lever leg curl"] },
  { name: "Lying Leg Curl", target: "Hamstrings", secondaryMuscles: ["Calves"], equipment: "Machine", searchQueries: ["lying leg curl", "lever lying leg curl"] },
  { name: "Seated Leg Curl", target: "Hamstrings", secondaryMuscles: ["Calves"], equipment: "Machine", searchQueries: ["seated leg curl", "lever seated leg curl"] },
  { name: "Single-Leg Curl", target: "Hamstrings", secondaryMuscles: ["Calves"], equipment: "Machine", searchQueries: ["single leg curl"] },
  { name: "Nordic Hamstring Curl", target: "Hamstrings", secondaryMuscles: ["Glutes"], equipment: "Bodyweight", searchQueries: ["nordic hamstring curl"] },
  { name: "Glute-Ham Raise", target: "Hamstrings", secondaryMuscles: ["Glutes", "Lower Back"], equipment: "Bodyweight", searchQueries: ["glute ham raise"] },

  // Glutes
  { name: "Barbell Hip Thrust", target: "Glutes", secondaryMuscles: ["Hamstrings", "Core"], equipment: "Barbell", searchQueries: ["barbell hip thrust"] },
  { name: "Dumbbell Hip Thrust", target: "Glutes", secondaryMuscles: ["Hamstrings", "Core"], equipment: "Dumbbell", searchQueries: ["dumbbell hip thrust"] },
  { name: "Smith Machine Hip Thrust", target: "Glutes", secondaryMuscles: ["Hamstrings", "Core"], equipment: "Smith Machine", searchQueries: ["smith hip thrust"] },
  { name: "Glute Bridge", target: "Glutes", secondaryMuscles: ["Hamstrings", "Core"], equipment: "Bodyweight", searchQueries: ["glute bridge"] },
  { name: "Dumbbell Glute Bridge", target: "Glutes", secondaryMuscles: ["Hamstrings", "Core"], equipment: "Dumbbell", searchQueries: ["dumbbell glute bridge"] },
  { name: "Cable Pull-Through", target: "Glutes", secondaryMuscles: ["Hamstrings", "Lower Back"], equipment: "Cable", searchQueries: ["cable pull through", "cable pull-through"] },

  // Calves
  { name: "Standing Calf Raise", target: "Calves", secondaryMuscles: [], equipment: "Machine", searchQueries: ["standing calf raise", "lever standing calf raise"] },
  { name: "Seated Calf Raise", target: "Calves", secondaryMuscles: [], equipment: "Machine", searchQueries: ["seated calf raise", "lever seated calf raise"] },
  { name: "Leg Press Calf Raise", target: "Calves", secondaryMuscles: [], equipment: "Leg Press Machine", searchQueries: ["leg press calf raise"] },
  { name: "Single-Leg Calf Raise", target: "Calves", secondaryMuscles: [], equipment: "Bodyweight", searchQueries: ["single leg calf raise"] },
  { name: "Dumbbell Calf Raise", target: "Calves", secondaryMuscles: [], equipment: "Dumbbell", searchQueries: ["dumbbell calf raise"] },
  { name: "Smith Machine Calf Raise", target: "Calves", secondaryMuscles: [], equipment: "Smith Machine", searchQueries: ["smith calf raise"] },
  { name: "Machine Calf Raise", target: "Calves", secondaryMuscles: [], equipment: "Machine", searchQueries: ["machine calf raise"] },

  // --- CORE ---
  // Bodyweight
  { name: "Lying Leg Raise", target: "Abdominals", secondaryMuscles: ["Hip Flexors"], equipment: "Bodyweight", searchQueries: ["lying leg raise", "leg raise"] },
  { name: "Hanging Leg Raise", target: "Abdominals", secondaryMuscles: ["Hip Flexors"], equipment: "Pull-Up Bar", searchQueries: ["hanging leg raise"] },
  { name: "Hanging Knee Raise", target: "Abdominals", secondaryMuscles: ["Hip Flexors"], equipment: "Pull-Up Bar", searchQueries: ["hanging knee raise"] },
  { name: "Reverse Crunch", target: "Abdominals", secondaryMuscles: ["Hip Flexors"], equipment: "Bodyweight", searchQueries: ["reverse crunch"] },
  { name: "Crunch", target: "Abdominals", secondaryMuscles: [], equipment: "Bodyweight", searchQueries: ["crunch"] },
  { name: "Sit-Up", target: "Abdominals", secondaryMuscles: ["Hip Flexors"], equipment: "Bodyweight", searchQueries: ["sit-up", "sit up"] },
  { name: "Bicycle Crunch", target: "Obliques", secondaryMuscles: ["Abdominals"], equipment: "Bodyweight", searchQueries: ["bicycle crunch", "air bike"] },
  { name: "V-Up", target: "Abdominals", secondaryMuscles: ["Hip Flexors"], equipment: "Bodyweight", searchQueries: ["v-up", "v up"] },
  { name: "Toe Touch", target: "Abdominals", secondaryMuscles: [], equipment: "Bodyweight", searchQueries: ["toe touchers", "toe touch"] },
  { name: "Flutter Kicks", target: "Abdominals", secondaryMuscles: ["Hip Flexors"], equipment: "Bodyweight", searchQueries: ["flutter kicks"] },
  { name: "Plank", target: "Abdominals", secondaryMuscles: ["Core", "Shoulders"], equipment: "Bodyweight", searchQueries: ["plank", "front plank"] },
  { name: "Side Plank", target: "Obliques", secondaryMuscles: ["Core"], equipment: "Bodyweight", searchQueries: ["side plank"] },
  { name: "Mountain Climber", target: "Abdominals", secondaryMuscles: ["Cardio", "Shoulders"], equipment: "Bodyweight", searchQueries: ["mountain climber"] },

  // Cable
  { name: "Cable Crunch", target: "Abdominals", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable crunch"] },
  { name: "Kneeling Cable Crunch", target: "Abdominals", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable kneeling crunch"] },
  { name: "Standing Cable Crunch", target: "Abdominals", secondaryMuscles: [], equipment: "Cable", searchQueries: ["cable standing crunch"] },
  { name: "Cable Woodchop", target: "Obliques", secondaryMuscles: ["Abdominals"], equipment: "Cable", searchQueries: ["cable woodchop", "cable twist"] },
  { name: "High-to-Low Cable Woodchop", target: "Obliques", secondaryMuscles: ["Abdominals"], equipment: "Cable", searchQueries: ["cable high to low woodchop", "high cable woodchop"] },
  { name: "Low-to-High Cable Woodchop", target: "Obliques", secondaryMuscles: ["Abdominals"], equipment: "Cable", searchQueries: ["cable low to high woodchop", "low cable woodchop"] },
  { name: "Pallof Press", target: "Abdominals", secondaryMuscles: ["Obliques"], equipment: "Cable", searchQueries: ["pallof press"] },
  { name: "Single-Arm Pallof Press", target: "Abdominals", secondaryMuscles: ["Obliques"], equipment: "Cable", searchQueries: ["single arm pallof press"] },

  // Dumbbell
  { name: "Dumbbell Side Bend", target: "Obliques", secondaryMuscles: [], equipment: "Dumbbell", searchQueries: ["dumbbell side bend"] },
  { name: "Dumbbell Russian Twist", target: "Obliques", secondaryMuscles: ["Abdominals"], equipment: "Dumbbell", searchQueries: ["dumbbell russian twist"] },
  { name: "Dumbbell Crunch", target: "Abdominals", secondaryMuscles: [], equipment: "Dumbbell", searchQueries: ["dumbbell crunch"] },
  { name: "Weighted Sit-Up", target: "Abdominals", secondaryMuscles: ["Hip Flexors"], equipment: "Weighted", searchQueries: ["weighted sit-up", "plate sit-up"] },
  { name: "Dumbbell Dead Bug", target: "Abdominals", secondaryMuscles: ["Core"], equipment: "Dumbbell", searchQueries: ["dumbbell dead bug"] },

  // Other
  { name: "Ab Wheel Rollout", target: "Abdominals", secondaryMuscles: ["Core", "Lats"], equipment: "Ab Wheel", searchQueries: ["ab wheel rollout", "ab roller"] },
  { name: "Stability Ball Crunch", target: "Abdominals", secondaryMuscles: [], equipment: "Stability Ball", searchQueries: ["stability ball crunch"] },
  { name: "Stability Ball Plank", target: "Abdominals", secondaryMuscles: ["Core"], equipment: "Stability Ball", searchQueries: ["stability ball plank"] },
  { name: "Dragon Flag", target: "Abdominals", secondaryMuscles: ["Core", "Lats"], equipment: "Bodyweight", searchQueries: ["dragon flag"] },
  { name: "Weighted Plank", target: "Abdominals", secondaryMuscles: ["Core", "Shoulders"], equipment: "Weighted", searchQueries: ["weighted plank"] },

];
