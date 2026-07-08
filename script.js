class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.scores = {
            X: 0,
            O: 0,
            draws: 0
        };
        this.winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        this.loadScores();
        this.initializeEventListeners();
        this.updateShareLink();
    }

    initializeEventListeners() {
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', (e) => this.handleCellClick(e));
        });

        document.getElementById('reset-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('reset-score-btn').addEventListener('click', () => this.resetScores());
        document.getElementById('copy-btn').addEventListener('click', () => this.copyShareLink());
    }

    handleCellClick(event) {
        const cell = event.target;
        const index = cell.dataset.index;

        if (this.board[index] !== null || !this.gameActive) {
            return;
        }

        this.board[index] = this.currentPlayer;
        cell.textContent = this.currentPlayer;
        cell.classList.add(this.currentPlayer.toLowerCase());

        if (this.checkWinner()) {
            this.endGame(`🎉 Player ${this.currentPlayer} Wins!`, true);
            this.scores[this.currentPlayer]++;
            this.updateScores();
            return;
        }

        if (this.board.every(cell => cell !== null)) {
            this.endGame("🤝 It's a Draw!", false);
            this.scores.draws++;
            this.updateScores();
            return;
        }

        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.updateStatus();
    }

    checkWinner() {
        return this.winningCombos.some(combo => {
            const [a, b, c] = combo;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                // Highlight winning cells
                document.querySelectorAll('.cell').forEach((cell, index) => {
                    if (combo.includes(index)) {
                        cell.classList.add('winner');
                    }
                });
                return true;
            }
            return false;
        });
    }

    endGame(message, hasWinner) {
        this.gameActive = false;
        const statusText = document.getElementById('status-text');
        const subStatus = document.getElementById('sub-status');
        statusText.textContent = message;
        subStatus.textContent = 'Click "New Game" to play again';
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.add('disabled');
        });
    }

    updateStatus() {
        document.getElementById('status-text').textContent = `Player ${this.currentPlayer}'s Turn`;
        document.getElementById('sub-status').textContent = '';
    }

    updateScores() {
        document.getElementById('x-score').textContent = this.scores.X;
        document.getElementById('o-score').textContent = this.scores.O;
        document.getElementById('draws').textContent = this.scores.draws;
        this.saveScores();
    }

    resetGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;

        document.querySelectorAll('.cell').forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'disabled', 'winner');
        });

        this.updateStatus();
    }

    resetScores() {
        if (confirm('Are you sure you want to reset all scores?')) {
            this.scores = { X: 0, O: 0, draws: 0 };
            this.updateScores();
            this.resetGame();
        }
    }

    saveScores() {
        localStorage.setItem('ticTacToeScores', JSON.stringify(this.scores));
    }

    loadScores() {
        const saved = localStorage.getItem('ticTacToeScores');
        if (saved) {
            this.scores = JSON.parse(saved);
            this.updateScores();
        }
    }

    updateShareLink() {
        document.getElementById('share-link').value = window.location.href;
    }

    copyShareLink() {
        const link = document.getElementById('share-link');
        link.select();
        document.execCommand('copy');
        
        const btn = document.getElementById('copy-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});