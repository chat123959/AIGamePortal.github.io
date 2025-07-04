
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Game, GameCategory, SortOption, ViewMode } from './types';
import { GAMES, CATEGORIES } from './constants';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import FilterSort from './components/FilterSort';
import GameList from './components/GameList';
import Footer from './components/Footer';
import GameModal from './components/GameModal';
import ThemeToggle from './components/ThemeToggle';
import GeminiGameSuggester from './components/GeminiGameSuggester';

const App: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selectedCategory, setSelectedCategory] = useState<GameCategory>(GameCategory.ALL);
    const [sortOption, setSortOption] = useState<SortOption>(SortOption.POPULAR);
    const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.GRID);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isSuggesterOpen, setIsSuggesterOpen] = useState<boolean>(false);

    useEffect(() => {
        // Simulate fetching data
        setTimeout(() => {
            setGames(GAMES);
            setIsLoading(false);
        }, 1500);
    }, []);

    const filteredAndSortedGames = useMemo(() => {
        let filtered = games;

        if (selectedCategory !== GameCategory.ALL) {
            filtered = filtered.filter(game => game.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        return [...filtered].sort((a, b) => {
            switch (sortOption) {
                case SortOption.NEWEST:
                    return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
                case SortOption.RATING:
                    return b.rating - a.rating;
                case SortOption.ALPHABETICAL:
                    return a.title.localeCompare(b.title);
                case SortOption.POPULAR:
                default:
                    return b.popularity - a.popularity;
            }
        });
    }, [games, selectedCategory, sortOption, searchTerm]);
    
    const handleSelectGame = useCallback((game: Game) => {
        setSelectedGame(game);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedGame(null);
    }, []);
    
    const handlePlaySuggestedGame = useCallback((gameTitle: string) => {
        const gameToPlay = games.find(g => g.title.toLowerCase() === gameTitle.toLowerCase());
        if (gameToPlay) {
            setIsSuggesterOpen(false);
            handleSelectGame(gameToPlay);
        }
    }, [games, handleSelectGame]);


    return (
        <div className="min-h-screen bg-gray-100 dark:bg-secondary flex flex-col transition-colors duration-300">
            <ThemeToggle />
            
            <Header 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm}
                onOpenSuggester={() => setIsSuggesterOpen(true)}
            />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full">
                <CategoryNav 
                    categories={CATEGORIES} 
                    selectedCategory={selectedCategory} 
                    setSelectedCategory={setSelectedCategory} 
                />
                
                <FilterSort
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    gamesCount={filteredAndSortedGames.length}
                    category={selectedCategory}
                />

                <GameList 
                    games={filteredAndSortedGames}
                    isLoading={isLoading}
                    viewMode={viewMode}
                    onSelectGame={handleSelectGame}
                />
            </main>
            
            <Footer />

            {selectedGame && (
                <GameModal 
                    game={selectedGame}
                    onClose={handleCloseModal}
                />
            )}
            
            {isSuggesterOpen && (
                <GeminiGameSuggester
                    isOpen={isSuggesterOpen}
                    onClose={() => setIsSuggesterOpen(false)}
                    games={games}
                    onPlayGame={handlePlaySuggestedGame}
                />
            )}
        </div>
    );
};

export default App;
