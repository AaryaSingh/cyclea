import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Plus, X, Globe, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FoodDetailsModal } from './FoodDetailsModal';

export interface FoodEntry {
  name: string;
  time: string;
  category: string;
  cuisine?: string;
  amount?: string; // portion size
}

interface FoodTrackerProps {
  onClose: () => void;
  onSave: (foods: FoodEntry[]) => void;
  symptom?: string;
}

// Culturally inclusive food database
const FOOD_DATABASE = {
  'African': [
    'Jollof Rice', 'Injera', 'Fufu', 'Egusi Soup', 'Pap (Maize Porridge)', 
    'Bobotie', 'Bunny Chow', 'Suya', 'Moin Moin', 'Akara', 'Plantain',
    'Kenkey', 'Banku', 'Couscous', 'Tagine', 'Harira', 'Koshari'
  ],
  'East Asian': [
    'Rice', 'Noodles', 'Dumplings', 'Sushi', 'Ramen', 'Miso Soup',
    'Kimchi', 'Bibimbap', 'Congee', 'Dim Sum', 'Fried Rice', 'Spring Rolls',
    'Udon', 'Soba', 'Tofu', 'Edamame', 'Mochi', 'Bao', 'Hotpot',
    'Mapo Tofu', 'Kung Pao Chicken', 'Peking Duck', 'Pho'
  ],
  'South Asian': [
    'Dal', 'Roti', 'Chapati', 'Naan', 'Biryani', 'Curry', 'Samosa',
    'Dosa', 'Idli', 'Paneer', 'Tikka Masala', 'Korma', 'Vindaloo',
    'Paratha', 'Raita', 'Chutney', 'Pakora', 'Bhaji', 'Aloo Gobi',
    'Tandoori', 'Saag', 'Khichdi', 'Pulao', 'Lassi', 'Chai'
  ],
  'Southeast Asian': [
    'Pad Thai', 'Pho', 'Bahn Mi', 'Curry Laksa', 'Rendang', 'Satay',
    'Nasi Goreng', 'Mee Goreng', 'Tom Yum', 'Green Curry', 'Red Curry',
    'Som Tam', 'Larb', 'Gado Gado', 'Lumpia', 'Adobo', 'Sinigang',
    'Hainanese Chicken Rice', 'Char Kway Teow', 'Bánh Xèo'
  ],
  'Middle Eastern': [
    'Hummus', 'Falafel', 'Shawarma', 'Tabbouleh', 'Baba Ganoush',
    'Kebab', 'Fattoush', 'Kibbeh', 'Mansaf', 'Musakhan', 'Maqluba',
    'Shakshuka', 'Labneh', 'Za\'atar', 'Halloumi', 'Baklava', 'Kunafa',
    'Dolma', 'Tahini', 'Pita Bread', 'Manakish', 'Mujadara'
  ],
  'Latin American': [
    'Tacos', 'Empanadas', 'Arepas', 'Pupusas', 'Tamales', 'Enchiladas',
    'Ceviche', 'Mofongo', 'Tostones', 'Beans', 'Rice', 'Guacamole',
    'Quesadilla', 'Burrito', 'Fajitas', 'Elote', 'Chiles Rellenos',
    'Pozole', 'Menudo', 'Chicharrón', 'Yuca', 'Ropa Vieja', 'Picadillo',
    'Bandeja Paisa', 'Feijoada', 'Pão de Queijo'
  ],
  'Caribbean': [
    'Jerk Chicken', 'Curry Goat', 'Rice and Peas', 'Ackee and Saltfish',
    'Roti', 'Doubles', 'Callaloo', 'Oxtail', 'Escovitch Fish', 'Festival',
    'Johnny Cakes', 'Conch Fritters', 'Pelau', 'Bake and Shark'
  ],
  'Mediterranean': [
    'Pizza', 'Pasta', 'Risotto', 'Paella', 'Gazpacho', 'Moussaka',
    'Spanakopita', 'Tzatziki', 'Souvlaki', 'Bruschetta', 'Caprese',
    'Focaccia', 'Polenta', 'Gnocchi', 'Antipasto', 'Horiatiki'
  ],
  'European': [
    'Bread', 'Cheese', 'Sausage', 'Schnitzel', 'Goulash', 'Pierogi',
    'Borscht', 'Croissant', 'Quiche', 'Crepe', 'Ratatouille',
    'Fish and Chips', 'Bangers and Mash', 'Shepherd\'s Pie', 'Haggis'
  ],
  'American': [
    'Burger', 'Hot Dog', 'Mac and Cheese', 'Fried Chicken', 'BBQ Ribs',
    'Sandwich', 'Salad', 'Soup', 'Steak', 'Grilled Cheese', 'Pancakes',
    'Waffles', 'Eggs', 'Bacon', 'Toast', 'Oatmeal', 'Cereal', 'Yogurt'
  ],
  'Snacks & Beverages': [
    'Fruit', 'Nuts', 'Seeds', 'Chips', 'Crackers', 'Cookies', 'Cake',
    'Ice Cream', 'Chocolate', 'Coffee', 'Tea', 'Juice', 'Smoothie',
    'Soda', 'Water', 'Milk', 'Protein Shake', 'Energy Drink'
  ],
};

// Common trigger foods for GI symptoms
const COMMON_TRIGGERS = [
  'Dairy', 'Gluten', 'Spicy Foods', 'Fried Foods', 'Caffeine',
  'Alcohol', 'Carbonated Drinks', 'High FODMAP', 'Processed Foods',
  'Artificial Sweeteners', 'Beans/Legumes', 'Cruciferous Vegetables',
  'Citrus Fruits', 'Raw Vegetables', 'Fatty Foods'
];

export function FoodTracker({ onClose, onSave, symptom }: FoodTrackerProps) {
  const [selectedFoods, setSelectedFoods] = useState<FoodEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customFood, setCustomFood] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');
  
  // For adding food with details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [pendingFood, setPendingFood] = useState<{ name: string; cuisine?: string } | null>(null);
  const [foodTime, setFoodTime] = useState('');
  const [foodAmount, setFoodAmount] = useState('');

  // Get all foods from database
  const allFoods = Object.entries(FOOD_DATABASE).flatMap(([cuisine, foods]) =>
    foods.map(food => ({ name: food, cuisine }))
  );

  // Filter foods by search query and cuisine
  const filteredFoods = allFoods.filter(({ name, cuisine }) => {
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === 'All' || cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const handleAddFood = (foodName: string, cuisine?: string) => {
    // Open details modal instead of adding directly
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    setPendingFood({ name: foodName, cuisine });
    setFoodTime(timeString);
    setFoodAmount('');
    setShowDetailsModal(true);
  };
  
  const handleConfirmAddFood = () => {
    if (!pendingFood) return;
    
    const newFood: FoodEntry = {
      name: pendingFood.name,
      time: foodTime,
      category: 'meal',
      cuisine: pendingFood.cuisine || 'Other',
      amount: foodAmount || undefined,
    };

    setSelectedFoods([...selectedFoods, newFood]);
    setSearchQuery('');
    setCustomFood('');
    setShowDetailsModal(false);
    setPendingFood(null);
  };

  const handleRemoveFood = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  const handleAddCustomFood = () => {
    if (customFood.trim()) {
      handleAddFood(customFood.trim());
    }
  };

  const handleSave = () => {
    onSave(selectedFoods);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto my-8">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-6 h-6 text-[#F487B6]" />
              <h2 className="text-2xl">Food Tracker</h2>
            </div>
            <Button onClick={onClose} variant="ghost" size="sm">
              <X className="w-5 h-5" />
            </Button>
          </div>
          {symptom && (
            <p className="text-sm text-gray-600">
              Track foods that may be related to <span className="font-semibold">{symptom}</span>
            </p>
          )}
          
          {/* Selected Foods */}
          {selectedFoods.length > 0 && (
            <div className="mt-4 p-3 bg-[#FFF0F5] rounded-lg">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Today's Log ({selectedFoods.length} items):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedFoods.map((food, index) => (
                  <Badge
                    key={index}
                    className="bg-[#F487B6] text-white pl-3 pr-1 py-1 flex items-center gap-2"
                  >
                    <span className="flex flex-col">
                      <span>{food.name}</span>
                      <span className="text-xs opacity-80">
                        {food.time}{food.amount && ` • ${food.amount}`}
                      </span>
                    </span>
                    <button
                      onClick={() => handleRemoveFood(index)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Search Bar */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search foods from any cuisine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Search Results */}
            {searchQuery && (
              <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                <p className="text-xs text-gray-600 mb-2">Quick Add:</p>
                <div className="flex flex-wrap gap-2">
                  {filteredFoods.slice(0, 20).map(({ name, cuisine }, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAddFood(name, cuisine)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {name}
                    </Button>
                  ))}
                  {filteredFoods.length === 0 && (
                    <p className="text-sm text-gray-500">No matches found</p>
                  )}
                </div>
              </div>
            )}

            {/* Custom Food Entry */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom food or dish..."
                value={customFood}
                onChange={(e) => setCustomFood(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomFood()}
              />
              <Button
                onClick={handleAddCustomFood}
                className="bg-[#4FB0AE]"
                disabled={!customFood.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
          </div>

          {/* Cuisine Categories */}
          <Tabs value={selectedCuisine} onValueChange={setSelectedCuisine}>
            <TabsList className="w-full flex flex-wrap h-auto">
              <TabsTrigger value="All" className="text-xs">All</TabsTrigger>
              {Object.keys(FOOD_DATABASE).map((cuisine) => (
                <TabsTrigger key={cuisine} value={cuisine} className="text-xs">
                  {cuisine}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCuisine} className="space-y-4 mt-4">
              {selectedCuisine === 'All' ? (
                // Show common triggers first
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-amber-600">⚠️</span> Common Trigger Foods
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    These foods commonly cause bloating, GI discomfort, or cycle-related symptoms
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {COMMON_TRIGGERS.map((trigger) => (
                      <Button
                        key={trigger}
                        onClick={() => handleAddFood(trigger)}
                        variant="outline"
                        size="sm"
                        className="border-amber-300 hover:bg-amber-50"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {trigger}
                      </Button>
                    ))}
                  </div>

                  {/* All cuisines */}
                  {Object.entries(FOOD_DATABASE).map(([cuisine, foods]) => (
                    <div key={cuisine} className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">{cuisine}</h4>
                      <div className="flex flex-wrap gap-2">
                        {foods.slice(0, 10).map((food) => (
                          <Button
                            key={food}
                            onClick={() => handleAddFood(food, cuisine)}
                            variant="outline"
                            size="sm"
                            className="text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {food}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Show specific cuisine
                <div>
                  <div className="flex flex-wrap gap-2">
                    {FOOD_DATABASE[selectedCuisine as keyof typeof FOOD_DATABASE]?.map((food) => (
                      <Button
                        key={food}
                        onClick={() => handleAddFood(food, selectedCuisine)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        {food}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Clinical Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>💡 Clinical Tip:</strong> Track foods for 2-3 cycles to identify patterns. 
              Your OBGYN can correlate GI symptoms with cycle phases to differentiate between 
              hormonal bloating vs. food sensitivities vs. IBS.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              className="flex-1 bg-[#F487B6] hover:bg-[#F487B6]/90"
              disabled={selectedFoods.length === 0}
            >
              Save {selectedFoods.length > 0 && `(${selectedFoods.length} items)`}
            </Button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && pendingFood && (
        <FoodDetailsModal
          foodName={pendingFood.name}
          onConfirm={(time, amount) => {
            setFoodTime(time);
            setFoodAmount(amount);
            handleConfirmAddFood();
          }}
          onCancel={() => {
            setShowDetailsModal(false);
            setPendingFood(null);
          }}
        />
      )}
    </div>
  );
}