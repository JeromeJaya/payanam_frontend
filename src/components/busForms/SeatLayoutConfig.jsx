const LAYOUT_TEMPLATES = [
  {
    id: "single-deck-2x2",
    name: "Single Deck 2+2 Seater",
    description: "Standard 2+2 layout with 4 seats per row",
    icon: "\uD83D\uDE8C",
    numDecks: 1,
    decks: {
      "1": { numColumns: 4, seatsPerColumn: [10, 10, 10, 10] }
    }
  },
  {
    id: "single-deck-2x1",
    name: "Single Deck 2+1 Sleeper",
    description: "2+1 sleeper layout with 3 seats per row",
    icon: "\uD83D\uDEEF\uFE0F",
    numDecks: 1,
    decks: {
      "1": { numColumns: 3, seatsPerColumn: [10, 10, 10] }
    }
  },
  {
    id: "double-deck-2x2",
    name: "Double Deck 2+2",
    description: "Double deck with 4 columns each",
    icon: "\uD83D\uDE8C",
    numDecks: 2,
    decks: {
      "1": { numColumns: 4, seatsPerColumn: [10, 10, 10, 10] },
      "2": { numColumns: 4, seatsPerColumn: [10, 10, 10, 10] }
    }
  },
  {
    id: "double-deck-2x1",
    name: "Double Deck 2+1 Sleeper",
    description: "Double deck sleeper with 3 columns each",
    icon: "\uD83D\uDEEF\uFE0F",
    numDecks: 2,
    decks: {
      "1": { numColumns: 3, seatsPerColumn: [10, 10, 10] },
      "2": { numColumns: 3, seatsPerColumn: [10, 10, 10] }
    }
  },
  {
    id: "single-deck-3x2",
    name: "Single Deck 3+2 Seater",
    description: "Wide layout with 5 seats per row",
    icon: "\uD83D\uDE8C",
    numDecks: 1,
    decks: {
      "1": { numColumns: 5, seatsPerColumn: [10, 10, 10, 10, 10] }
    }
  }
];

export default function SeatLayoutConfig({
  layoutStep, setLayoutStep,
  selectedTemplate, setSelectedTemplate,
  numDecks, setNumDecks,
  currentDeck, setCurrentDeck,
  deckConfigs,
  formData,
  handleSelectTemplate,
  handleSetDecks,
  handleSetColumnsForDeck,
  handleSetSeatsPerColumnForDeck,
  updateNumColumnsForDeck,
  updateSeatsForColumn,
  openSeatEditor,
  onResetLayout
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
          Seat Layout Configuration
        </h3>
        {layoutStep > 1 && (
          <button
            type="button"
            onClick={onResetLayout}
            className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            Reset Layout
          </button>
        )}
      </div>

      {layoutStep === 1 && (
        <div className="bg-slate-50 p-6 rounded-lg space-y-4">
          <div className="text-center space-y-2">
            <h4 className="text-lg font-bold text-slate-900">Step 1: Choose Layout</h4>
            <p className="text-sm text-slate-600">Select a template or create custom layout</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LAYOUT_TEMPLATES.map(template => (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelectTemplate(template)}
                className={`p-4 border-2 rounded-lg text-left transition-all hover:border-lime-500 hover:shadow-md ${
                  selectedTemplate === template.id
                    ? "border-lime-500 bg-lime-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="text-3xl mb-2">{template.icon}</div>
                <div className="text-sm font-bold text-slate-900 mb-1">{template.name}</div>
                <div className="text-xs text-slate-600">{template.description}</div>
                <div className="text-xs text-slate-500 mt-2">
                  {template.numDecks === 1 ? 'Single Deck' : 'Double Deck'} {Object.values(template.decks).reduce((sum, d) => sum + d.seatsPerColumn.reduce((a, b) => a + b, 0), 0)} seats
                </div>
              </button>
            ))}
          </div>

          <div className="border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => {
                setSelectedTemplate(null);
                setLayoutStep(2);
              }}
              className="w-full p-4 border-2 border-dashed border-slate-300 rounded-lg text-center hover:border-lime-500 hover:bg-slate-50 transition-all"
            >
              <div className="text-2xl mb-2">{'\u2699\uFE0F'}</div>
              <div className="text-sm font-bold text-slate-900">Create Custom Layout</div>
              <div className="text-xs text-slate-600">Manually configure decks and columns</div>
            </button>
          </div>
        </div>
      )}

      {layoutStep === 2 && (
        <div className="bg-slate-50 p-6 rounded-lg text-center space-y-4">
          <h4 className="text-lg font-bold text-slate-900">Step 2: Configure Decks</h4>
          <p className="text-sm text-slate-600">Enter the number of decks in your bus</p>
          <div className="max-w-xs mx-auto">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Decks *</label>
            <input
              type="number"
              value={numDecks}
              onChange={(e) => setNumDecks(parseInt(e.target.value) || 0)}
              min="1"
              max="2"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="e.g., 1 or 2"
            />
            <p className="text-xs text-slate-500 mt-1">Usually 1 (single deck) or 2 (double deck)</p>
          </div>
          <button
            type="button"
            onClick={handleSetDecks}
            disabled={numDecks <= 0}
            className="px-6 py-2.5 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors"
          >
            Next: Configure {currentDeck === 1 ? 'Lower' : 'Upper'} Deck
          </button>
        </div>
      )}

      {layoutStep === 3 && (
        <div className="bg-slate-50 p-6 rounded-lg text-center space-y-4">
          <h4 className="text-lg font-bold text-slate-900">
            Step 2: Configure {currentDeck === 1 ? 'Lower' : 'Upper'} Deck
          </h4>
          <p className="text-sm text-slate-600">
            Enter the number of vertical columns for {currentDeck === 1 ? 'lower' : 'upper'} deck
          </p>
          <div className="max-w-xs mx-auto">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Number of Columns (Deck {currentDeck}) *
            </label>
            <input
              type="number"
              value={deckConfigs[currentDeck]?.numColumns || ""}
              onChange={(e) => updateNumColumnsForDeck(e.target.value)}
              min="1"
              max="10"
              className="w-full px-4 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
              placeholder="e.g., 2 or 3"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                if (currentDeck > 1) {
                  setCurrentDeck(prev => prev - 1);
                } else {
                  setLayoutStep(1);
                }
              }}
              className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSetColumnsForDeck}
              disabled={!deckConfigs[currentDeck]?.numColumns || deckConfigs[currentDeck].numColumns <= 0}
              className="flex-1 px-4 py-2.5 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors"
            >
              Next: Set Seats Per Column
            </button>
          </div>
        </div>
      )}

      {layoutStep === 4 && (
        <div className="bg-slate-50 p-6 rounded-lg space-y-4">
          <h4 className="text-lg font-bold text-slate-900">
            Step 3: Seats Per Column - {currentDeck === 1 ? 'Lower' : 'Upper'} Deck
          </h4>
          <p className="text-sm text-slate-600">
            Enter the number of seats for each column in {currentDeck === 1 ? 'lower' : 'upper'} deck
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deckConfigs[currentDeck]?.seatsPerColumn?.map((seats, colIndex) => (
              <div key={colIndex}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Column {colIndex + 1}
                </label>
                <input
                  type="number"
                  value={deckConfigs[currentDeck].seatsPerColumn[colIndex] || ""}
                  onChange={(e) => updateSeatsForColumn(colIndex, e.target.value)}
                  min="1"
                  className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
                  placeholder="Seats"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setLayoutStep(2)}
              className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSetSeatsPerColumnForDeck}
              disabled={!deckConfigs[currentDeck]?.seatsPerColumn?.some(s => s > 0)}
              className="flex-1 px-4 py-2.5 bg-lime-600 hover:bg-lime-700 disabled:bg-slate-300 text-white font-bold rounded-lg transition-colors"
            >
              {currentDeck < numDecks ? 'Next Deck' : 'Generate Layout'}
            </button>
          </div>
        </div>
      )}

      {layoutStep === 5 && formData.seatLayout.length > 0 && (
        <>
          <div className="flex flex-wrap gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-blue-100 border-2 border-blue-300 rounded"></div>
              <span className="font-medium text-slate-700">Seater</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-purple-100 border-2 border-purple-300 rounded"></div>
              <span className="font-medium text-slate-700">Sleeper</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-amber-100 border-2 border-amber-300 rounded"></div>
              <span className="font-medium text-slate-700">Semi-Sleeper</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg max-h-96 overflow-y-auto">
            <div className="flex flex-row justify-around">
              {(() => {
                const decks = {};
                formData.seatLayout.forEach((seat) => {
                  if (!decks[seat.deck]) {
                    decks[seat.deck] = [];
                  }
                  decks[seat.deck].push(seat);
                });

                return Object.keys(decks).sort((a, b) => {
                  if (a === 'lower') return -1;
                  if (b === 'lower') return 1;
                  return 0;
                }).map(deckName => (
                  <div key={deckName} className="flex flex-col gap-2">
                    <div className="text-center text-xs font-bold text-slate-600 mb-2 capitalize">
                      {deckName} Deck
                    </div>

                    <div className="flex gap-2 justify-center">
                      {(() => {
                        const columns = {};
                        decks[deckName].forEach((seat) => {
                          if (!columns[seat.column]) {
                            columns[seat.column] = [];
                          }
                          columns[seat.column].push(seat);
                        });

                        return Object.keys(columns).sort((a, b) => parseInt(a) - parseInt(b)).map(colNum => (
                          <div key={colNum} className="flex flex-col gap-0">
                            {columns[colNum].sort((a, b) => a.row - b.row).map((seat) => {
                              const seatColors = {
                                seater: "bg-blue-100 border-blue-400 hover:border-blue-600 hover:bg-blue-200",
                                sleeper: "bg-purple-100 border-purple-400 hover:border-purple-600 hover:bg-purple-200",
                                semi_sleeper: "bg-amber-100 border-amber-400 hover:border-amber-600 hover:bg-amber-200"
                              };
                              const seatHeights = {
                                seater: "h-10",
                                sleeper: "h-30",
                                semi_sleeper: "h-20"
                              };
                              const colorClass = seatColors[seat.seatCategory] || seatColors.seater;
                              const heightClass = seatHeights[seat.seatCategory] || seatHeights.seater;

                              return (
                                <button
                                  key={seat.seatNumber}
                                  type="button"
                                  onClick={() => openSeatEditor(formData.seatLayout.findIndex(s => s.seatNumber === seat.seatNumber))}
                                  className={`w-10 pr-1 ${heightClass} border-2 border-l-0 border-t-0 border-b-0 border-r-0 rounded-2xl flex items-center justify-center font-bold transition-all shadow-sm ${colorClass}`}
                                  title={`${seat.seatNumber} - ${seat.seatCategory.replace('_', ' ')} - \u20B9${seat.fare}\nDeck: ${seat.deck}\nCol: ${seat.column}, Row: ${seat.row}\nClick to customize`}
                                >
                                  {seat.seatNumber}
                                </button>
                              );
                            })}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <p className="text-xs text-slate-500 text-center">
            Total: {formData.seatLayout.length} seats | Click on any seat to customize its type and price
          </p>
        </>
      )}
    </div>
  );
}
