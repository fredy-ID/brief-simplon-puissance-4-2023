<template>
    <div v-if="playerToken">
        <div class="relative" v-if="!joinGame">
            <div v-if="activeGames.length > 0 || challengeGames.length > 0">
                <div class="" v-if="gameSelected && canPlay">
                    <!-- <NameSelector v-if="gameSelection" /> -->
                    <ColorSelector v-if="colorSelection" :playersList="players" />
                    <PlayScreen :color="currentPlayer?.color" :name="currentPlayer?.name" />
                    <VictoryScreen v-if="gameOver" :color="winner?.color" :name="winner?.name" @start-new-game-event="restartGame"/>
                    <Grid :color="currentPlayer?.color" :grid="grid" @drop-event="gameEvent" />
                    <!-- <ChatPopUp /> -->
                </div>
                <div v-else>
                    <ActiveGames v-if="activeGames.length > 0" :creator="user?.name" :activeGames="activeGames" @init-game-event="init" @can-play-event="play">
                        <h3 class="text-3xl text-center">Vos défis</h3>
                    </ActiveGames>
                    <ActiveGames v-if="challengeGames.length > 0" :creator="user?.name" :activeGames="challengeGames" @init-game-event="init" @can-play-event="play">
                        <h3 class="text-3xl text-center">Tout vos challenges</h3>
                    </ActiveGames>
                </div>
            </div>
            <div v-if="!gameSelected">
                <NewGame @new-game-event="createNewGame" @join-new-game-event="joinNewGame" />
            </div>
        </div>
        <div v-else>
            <JoinNewGame :player="user?.player"  @can-play-event="play" />
        </div>
    </div>
    <div v-else>
        <CreateProfile @create-profile-event="generateToken" v-if="createProfile" /> 
        
        <div class="hero min-h-screen bg-base-200" v-else>
            <div class="hero-content text-center">
              <div class="max-w-md">
                <h1 class="text-5xl font-bold">Bonjour!</h1>
                <p class="py-6">Cliquez pour participer !</p>
                <button class="btn btn-primary" @click="init()">C'est partit !</button>
              </div>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { useAuthStore } from '@/stores/auth'
import axiosApiIntance from "@/services/axiosApiIntance"

import io from 'socket.io-client';
const socket = io.connect('http://localhost:3001');

// AUTH

interface User {
    token: string | null, 
    name: string | null, 
    player: string | null
}

const user: Ref<User | undefined> = ref();
const playerToken: Ref<string | undefined> = ref();
const createProfile: Ref<boolean> =  ref(false);


async function init() {
    if(localStorage && localStorage.getItem('token') != null) {
        console.log("localStorage.getItem('token')", localStorage.getItem('token'))
        console.log("localStorage.getItem('token')", localStorage.getItem('name'))
        console.log("localStorage.getItem('token')", localStorage.getItem('player'))
        user.value = {
            token: localStorage.getItem('token'),
            name: localStorage.getItem('name'),
            player: localStorage.getItem('player'),
        }

        if(user?.value?.token != null) {
            playerToken.value = user.value.token

            const data = {
                creator: user.value.player
            }

            await axiosApiIntance.post('/api/user/activeGames', data)
            .then(async (response: any) => {
                    console.log(response.data)
                    activeGames.value = response.data.game
                })
                .catch((error: Promise<{}>) => {
                console.log(error)
            });

            await axiosApiIntance.post('/api/user/challengeGames', data)
            .then(async (response: any) => {
                    console.log(response.data)
                    challengeGames.value = response.data.game
                })
                .catch((error: Promise<{}>) => {
                console.log(error)
            });
        }
    } else {
        createProfile.value = true;
    }

    console.log('activeGames', activeGames.value)
    console.log('challengeGames', challengeGames.value)
}

async function generateToken(data : {name: string}): Promise<void> {
    const auth = useAuthStore()
    console.log(data.name)

    await axiosApiIntance.post('/api/user/generateToken', data)
    .then(async (response: any) => {
            await auth.setUser(response.data);
            await init();
            console.log(response.data)
            console.log('localstorage', localStorage)
        })
        .catch((error: Promise<{}>) => {
        console.log(error)
    });
}

// GAME

interface Players {
    id: number;
    name: string;
    color: string;
    creator: string, 
}

interface Game {
    id: number;
    reference: string;
    challenger: number;
}

const board: Ref<string[][]> = ref([
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"]
]);

const grid: Ref<string[][]> = ref([
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"],
    ["E", "E", "E", "E", "E", "E", "E"]
]);

const players: Ref<Players[] | undefined> =  ref()
const gameSelection: Ref<boolean> = ref(false);
const colorSelection: Ref<boolean> = ref(false);
const gameOver: Ref<boolean> = ref(false);
const currentPlayer: Ref<Players | undefined> = ref();
const winner: Ref<Players | undefined> = ref();
const gameSelected: Ref<boolean> =  ref(false);
const activeGames: Ref<Game[]> = ref([]);
const challengeGames: Ref<Game[]> = ref([]);
const joinGame: Ref<boolean> = ref(false);
const canPlay: Ref<boolean> = ref(false);

socket.on('connection', () => {
    console.log('Connecté au serveur Socket.io');
});

socket.on('new_action', (data: {action: number, game: Game}) => {
    if(players.value){

        currentPlayer.value = players.value[data.action];
        console.log("currentPlayer.value", currentPlayer.value)
    }
});

socket.on('set_players', (data: {creator: Players, challenger: Players}) => {
    players.value = []
    players.value.push(data.creator)
    players.value.push(data.challenger)

    players.value[0].color = 'R';
    players.value[1].color = 'Y';

});

function play(state: {canPlay: boolean, reference: string}) {
    if(state.canPlay) {

        console.log("state.reference", state.reference)

        socket.emit('join_room', state.reference);
        socket.emit('playAction', {room: state.reference});  

        gameSelected.value = true;
        canPlay.value = true;

        console.log("CAN PLAY", canPlay.value)
    }
}

function createNewGame(creator: {creator: string, challenger: number, name: string, gameId: number, gameReference: string}){
    const Creator: Players = {
        id: 1, 
        name: creator.name, 
        creator: creator.creator, 
        color: "R"
    };
    const Game: Game = {
        id: creator.gameId,
        reference: creator.gameReference,
        challenger: creator.challenger,
    }

    if (!players.value) {
        players.value = [];
    }

    players.value.push(Creator);
    activeGames.value.push(Game);
    
}

function joinNewGame() {
    joinGame.value = true;
}

function gameEvent(stateOfPlay: { color: string; row: number; col: number }) {
    console.log('stateOfPlay: ', stateOfPlay);

    // TODO : Envoyer changement etat grid en ligne
    grid.value[stateOfPlay.row][stateOfPlay.col] = stateOfPlay.color;

    if (checkVictory(grid.value, stateOfPlay.row, stateOfPlay.col, stateOfPlay.color)) {
        gameOver.value = true;
        winner.value = currentPlayer.value;
        currentPlayer.value = undefined;
        console.log(`Le joueur ${stateOfPlay.color} a gagné !`);
    } else {
        if (currentPlayer && currentPlayer.value) {
            currentPlayer.value = hasPlayed(currentPlayer.value);
        }
    }
}



function hasPlayed(hasPlayedPlayer: Players) {
    if (gameSelection.value) {
        return;
    }
    if (colorSelection.value) {
        return;
    }
    if(players && players.value) {
        return players.value.find(p => p.color !== hasPlayedPlayer.color);
    }
}

function restartGame() {
    console.log("Starting new game...");
    // copie profonde (deep copy) des tableaux à l'intérieur de board.value avant de les assigner à grid.value
    // Pour éviter que la Référence en mémoire modifie la valeur de board.value
    grid.value = JSON.parse(JSON.stringify(board.value));

    console.log('board: ', board.value)

    if(players && players.value) {
        gameOver.value = false;
        currentPlayer.value = players.value.find(p => p.color !== winner?.value?.color);
        winner.value = undefined;
    }
}

function checkVictory(grid: string[][], row: number, col: number, player: string): boolean {
    // Vérification en hauteur
    for (let i = 0; i <= grid.length - 4; i++) {
        if (
            grid[i][col] === player &&
            grid[i + 1][col] === player &&
            grid[i + 2][col] === player &&
            grid[i + 3][col] === player
        ) {
            return true;
        }
    }

    // Vérification en largeur
    for (let j = 0; j <= grid[row].length - 4; j++) {
        if (
            grid[row][j] === player &&
            grid[row][j + 1] === player &&
            grid[row][j + 2] === player &&
            grid[row][j + 3] === player
        ) {
            return true;
        }
    }

    // Vérification en diagonale (bas gauche vers haut droite)
    for (let i = 3; i < grid.length; i++) {
        for (let j = 0; j <= grid[i].length - 4; j++) {
            if (
                grid[i][j] === player &&
                grid[i - 1][j + 1] === player &&
                grid[i - 2][j + 2] === player &&
                grid[i - 3][j + 3] === player
            ) {
                return true;
            }
        }
    }

    // Vérification en diagonale (haut gauche vers bas droite)
    for (let i = 0; i <= grid.length - 4; i++) {
        for (let j = 0; j <= grid[i].length - 4; j++) {
            if (
                grid[i][j] === player &&
                grid[i + 1][j + 1] === player &&
                grid[i + 2][j + 2] === player &&
                grid[i + 3][j + 3] === player
            ) {
                return true;
            }
        }
    }

    return false;
}

</script>