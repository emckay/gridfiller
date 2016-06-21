# Grid Filler

Grid Filler is a 2D-grid puzzle editor.

This project is a work in progress. The following features still need to be added:

- ~~Relative content styles tools (e.g. position, font size)~~
- ~~Toggle content style tools (e.g. bold/italic)~~
- ~~Style settings page~~
- ~~Vertical center content divs~~
- ~~Arrow key cell navigation~~
- Puzzle type templates and reset checkpoints
- Clear all content formatting tool
- Version numbers for migrations in grid serialization
- Cell copy and pasting/cell template gallery
- Better styling for content input
- Save state in localstorage
- Appropriate cursor behavior
- Flexible number of rows/cols

Known issues:

- Cells still active for content adding after mode has switchd
- Events in undo history should be throttled and limited
- Application freezes when importing invalid state
