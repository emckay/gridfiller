# Grid Filler

Grid Filler is a 2D-grid puzzle editor.

See it in action: [gridfiller.com](https://www.gridfiller.com)

![superhero puzzle](/superhero.png)

Puzzle by Serkan Yurekli. [Original source](http://www.gmpuzzles.com/blog/2016/06/star-battle-small-regions-by-serkan-yurekli-3/)

This project is a work in progress. The following features still need to be added:

- ~~Relative content styles tools (e.g. position, font size)~~
- ~~Toggle content style tools (e.g. bold/italic)~~
- ~~Vertical center content divs~~
- ~~Arrow key cell navigation~~
- ~~Reset checkpoints~~
- ~~Clear all content formatting tool~~
- Style settings page
- Cell copy and pasting/cell template gallery
- Better styling for content input
- Save state in localstorage
- Appropriate cursor behavior
- Flexible number of rows/cols
- Puzzle type templates
- Version numbers for migrations in grid serialization
- Error handling for invalid state

Known issues:

- Cells still active for content adding after mode has switched
- Events in undo history should be throttled and limited
- Application freezes when importing invalid state
