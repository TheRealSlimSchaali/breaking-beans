# Daily Barista Workflow

The Breaking Beans UI is optimized for quick data entry on a kitchen tablet or mobile phone.

## Logging a Shot

1. **Select your Batch**: Using the `custom:breaking-beans-card`, select the active batch you are brewing with.
2. **Enter Parameters**: Input Dose (g), Yield (g), Time (s), and Grind Setting.
3. **Taste Profiling**: Rate the shot (1-5 stars) and optionally tag it with a flavor profile (Sour, Bitter, Balanced, Sweet).
4. **Submit**: Once saved, the integration automatically updates your active bean stock and increments your hardware wear-and-tear counters.

## Choked Shots (`is_choked`)

If your grind was too fine and the machine choked (no liquid came out):
- Toggle the **Choked** flag.
- The yield is automatically registered as `0g`.
- The entry is visually flagged in your history, providing valuable negative feedback to your dial-in workflow without ruining your yield averages. It will also display on the analytics charts to show danger zones for grind size.

## Dialing In (`is_dial_in`)
When establishing the initial grind size for a new bag, you may dump shots into the sink.
- Mark these as **Dial-In**.
- They will still safely consume your inventory stock and grinder wear, but they won't severely negatively impact the average taste score of the coffee on your dashboard.

## Editing & Idempotency

Made a mistake in your logging? Don't worry.
If you edit or delete a past shot, the Breaking Beans database (`store.py`) is completely idempotent:
- Deleting an 18g shot automatically "refunds" 18g to the correct batch's `remaining_weight`.
- Hardware counters are rolled back gracefully.
