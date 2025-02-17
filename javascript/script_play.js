window.onload = () => {
    updateCounterDisplay();
    updateButtonStates();
};

const audio = new Audio("../musiques/index.mp3");
audio.loop = true;
audio.volume = 0.3;

document.addEventListener("click", () => {
    audio.play().catch(err => {
        console.error("La lecture de la musique a échoué : ", err);
    });
}, { once: true });

const volumeButton = document.getElementById("volume-button");
const volumeControl = document.getElementById("volume-control");
const volumeSlider = document.getElementById("volume-slider");
const closeButton = document.getElementById("close-button");

volumeButton.addEventListener("click", () => {
    volumeControl.style.display = "flex";
});

closeButton.addEventListener("click", () => {
    volumeControl.style.display = "none";
});

volumeSlider.addEventListener("input", (event) => {
    audio.volume = event.target.value;
});

const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

const particlesArray = [];
const numberOfParticles = 300;

class Particle {
    constructor(x, y, size, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,250, 250, 0.6)';
        ctx.fill();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) {
            this.speedX *= -1;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.speedY *= -1;
        }
    }
}

function initParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 5 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 1.5;
        const speedY = (Math.random() - 0.5) * 1.5;
        particlesArray.push(new Particle(x, y, size, speedX, speedY));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Nettoie l'écran

    particlesArray.forEach(particle => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray.length = 0;
});

function showPopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    const closeButton = document.getElementById("closeButton");
    const countdown = document.getElementById("countdown");
    
    popup.style.display = "block";
    overlay.style.display = "block";
    
    closeButton.disabled = true;
    let timeLeft = 10;
    countdown.textContent = `Veuillez patienter ${timeLeft} secondes`;
    
    const timer = setInterval(() => {
        timeLeft--;
        countdown.textContent = `Veuillez patienter ${timeLeft} secondes`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            closeButton.disabled = false;
            countdown.textContent = "Vous pouvez maintenant fermer la fenêtre.";
        }
    }, 1000);
}

function closePopup() {
    const popup = document.getElementById("popup");
    const overlay = document.getElementById("overlay");
    popup.style.display = "none";
    overlay.style.display = "none";
}

document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    showPopup();
});

document.addEventListener("keydown", function (event) {
    if (event.key === "F12" || (event.ctrlKey && event.shiftKey && event.key === "I")) {
        event.preventDefault();
        showPopup();
    }
});

let clicsRecents = 0;
const limiteClicsParSeconde = 12;
const intervalleDeTemps = 1200;

function verifierClicsParSeconde() {
    clicsRecents++;

    if (clicsRecents > limiteClicsParSeconde) {
        showPopup();
        clicsRecents = 0;
    }
}

setInterval(() => {
    clicsRecents = 0;
}, intervalleDeTemps);

document.addEventListener('click', () => {
    verifierClicsParSeconde();
});


let counter = parseInt(localStorage.getItem('clickCount')) || 0;
let clickValue = parseInt(localStorage.getItem('clickValue')) || 1;
let trophies = JSON.parse(localStorage.getItem('trophies')) || [];
let buildings = JSON.parse(localStorage.getItem('buildings')) || {
    'cadran-solaire': 0,
    'sablier': 0,
    'horloge-a-coucou': 0,
    'montre-de-poche': 0,
    'calendrier-perpetuel': 0,
    'reveil': 0,
    'tourdelhorloge': 0,
    'temple-du-temps': 0,
    'chronometre-universel': 0,
    'machine-a-remonter-le-temps': 0,
    'spirale-temporelle': 0,
    'station-temporelle': 0,
    'astrolabe-mystique': 0,
    'cristal-du-temps': 0,
    'observatoire-temporel': 0
};
let buildingPrices = JSON.parse(localStorage.getItem('buildingPrices')) || {
    'cadran-solaire': 15,
    'sablier': 100,
    'horloge-a-coucou': 1100,
    'montre-de-poche': 12000,
    'calendrier-perpetuel': 130000,
    'reveil': 1400000,
    'tourdelhorloge': 20000000,
    'temple-du-temps': 330000000,
    'chronometre-universel': 5100000000,
    'machine-a-remonter-le-temps': 75000000000,
    'spirale-temporelle': 1000000000000,
    'station-temporelle': 14000000000000,
    'astrolabe-mystique': 170000000000000,
    'cristal-du-temps': 2100000000000000,
    'observatoire-temporel': 26000000000000000
};

let currentUpgradeIndex = parseInt(localStorage.getItem('currentUpgradeIndex')) || 0;
let upgrades = [
    { id: 'double-click', name: '1 clic = 2 points', cost: 100, increment: 2 },
    { id: 'quad-click', name: '1 clic = 4 points', cost: 500, increment: 4 },
    { id: 'octo-click', name: '1 clic = 8 points', cost: 10000, increment: 8 },
    { id: 'leneuf-click', name: '1 clic = 20 points', cost: 50000, increment: 12 },
    { id: 'super-click', name: '1 clic = 40 points', cost: 100000, increment: 40 },
    { id: 'mega-click', name: '1 clic = 400 points', cost: 10000000, increment: 400 },
    { id: 'ultra-click', name: '1 clic = 8 000 points', cost: 100000000, increment: 8000 },
    { id: 'god-click', name: '1 clic = 160 000 points', cost: 10000000000, increment: 160000 },
    { id: 'legendary-click', name: '1 clic = 3.2 millions de points', cost: 10000000000000, increment: 3200000 },
    { id: 'divine-click', name: '1 clic = 64 millions de points', cost: 10000000000000000, increment: 64000000 }
];

const counterDisplay = document.getElementById('counter');
const compteurButton = document.getElementById('compteur');
const cpsDisplay = document.getElementById('cps');
const upgradeDescription = document.getElementById('upgrade-description');
const buyUpgradeButton = document.getElementById('buy-upgrade');

function formatNumberWithAbbreviation(number) {
    if (number >= 1e15) {
        return (number / 1e15).toFixed(1) + " billiards";
    } else if (number >= 1e12) {
        return (number / 1e12).toFixed(1) + " billions";
    } else if (number >= 1e9) {
        return (number / 1e9).toFixed(1) + " milliards";
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(1) + " millions";
    } else {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
}

function formatNumberWithAbbreviationv2(number) {
    if (number >= 1e15) {
        return (number / 1e15).toFixed(0) + " billiards";
    } else if (number >= 1e12) {
        return (number / 1e12).toFixed(0) + " billions";
    } else if (number >= 1e9) {
        return (number / 1e9).toFixed(0) + " milliards";
    } else if (number >= 1e6) {
        return (number / 1e6).toFixed(0) + " millions";
    } else {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
}

function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function updateCounterDisplay() {
    counterDisplay.textContent = counter.toFixed(0);
    updateUpgradeInfo();
}

compteurButton.addEventListener('click', () => {
    counter += clickValue;
    updateCounterDisplay();
    checkForTrophies();
    localStorage.setItem('clickCount', counter);
});

compteurButton.addEventListener('click', () => {
    compteurButton.classList.add('active');

    setTimeout(() => {
        compteurButton.classList.remove('active');
    }, 100);
});


function updateButtonStates() {
    const buttons = document.querySelectorAll('.shop .building button');
    buttons.forEach(button => {
        const buildingId = button.id.replace('b', '');
        const cost = buildingPrices[Object.keys(buildingPrices)[buildingId - 1]];

        if (counter >= cost) {
            button.disabled = false;
            button.style.backgroundColor = "white";
            button.style.color = "black";
            button.style.cursor = "pointer";
        } else {
            button.disabled = true;
            button.style.backgroundColor = "lightgray";
            button.style.color = "gray";
            button.style.cursor = "not-allowed";
        }
    });
}

function updateCounterDisplay() {
    counterDisplay.textContent = formatNumber(counter.toFixed(0));
    updateUpgradeInfo();
    updateButtonStates();
}


function updateBuildingPrices() {
    document.getElementById('b1').textContent = `${formatNumberWithAbbreviation(buildingPrices['cadran-solaire'])} points = Cadran solaire (+0.1 pt/s) [x${buildings['cadran-solaire']}]`;
    document.getElementById('b2').textContent = `${formatNumberWithAbbreviation(buildingPrices['sablier'])} points = Sablier (+1 pt/s) [x${buildings['sablier']}]`;
    document.getElementById('b3').textContent = `${formatNumberWithAbbreviation(buildingPrices['horloge-a-coucou'])} points = Horloge à coucou (+8 pts/s) [x${buildings['horloge-a-coucou']}]`;
    document.getElementById('b4').textContent = `${formatNumberWithAbbreviation(buildingPrices['montre-de-poche'])} points = Montre de poche (+47 pts/s) [x${buildings['montre-de-poche']}]`;
    document.getElementById('b5').textContent = `${formatNumberWithAbbreviation(buildingPrices['calendrier-perpetuel'])} points = Calendrier perpétuel (+260 pts/s) [x${buildings['calendrier-perpetuel']}]`;
    document.getElementById('b6').textContent = `${formatNumberWithAbbreviation(buildingPrices['reveil'])} points = Réveil (+1 400 pts/s) [x${buildings['reveil']}]`;
    document.getElementById('b7').textContent = `${formatNumberWithAbbreviation(buildingPrices['tourdelhorloge'])} points = Tour de l'horloge (+7 800 pts/s) [x${buildings['tourdelhorloge']}]`;
    document.getElementById('b8').textContent = `${formatNumberWithAbbreviation(buildingPrices['temple-du-temps'])} points = Machine à remonter le temps (+40 000 pts/s) [x${buildings['temple-du-temps']}]`;
    document.getElementById('b9').textContent = `${formatNumberWithAbbreviation(buildingPrices['chronometre-universel'])} points = Chronomètre universel (+260 000 pts/s) [x${buildings['chronometre-universel']}]`;
    document.getElementById('b10').textContent = `${formatNumberWithAbbreviation(buildingPrices['machine-a-remonter-le-temps'])} points = Temple du temps (+1.6 million pts/s) [x${buildings['machine-a-remonter-le-temps']}]`;
    document.getElementById('b11').textContent = `${formatNumberWithAbbreviation(buildingPrices['spirale-temporelle'])} points = Spirale temporelle (+10 millions pts/s) [x${buildings['spirale-temporelle']}]`;
    document.getElementById('b12').textContent = `${formatNumberWithAbbreviation(buildingPrices['station-temporelle'])} points = Station temporelle (+65 millions pts/s) [x${buildings['station-temporelle']}]`;
    document.getElementById('b13').textContent = `${formatNumberWithAbbreviation(buildingPrices['astrolabe-mystique'])} points = Astrolabe mystique (+430 millions pts/s) [x${buildings['astrolabe-mystique']}]`;
    document.getElementById('b14').textContent = `${formatNumberWithAbbreviation(buildingPrices['cristal-du-temps'])} points = Cristal du temps (+2.9 milliards pts/s) [x${buildings['cristal-du-temps']}]`;
    document.getElementById('b15').textContent = `${formatNumberWithAbbreviation(buildingPrices['observatoire-temporel'])} points = Observatoire temporel (+21 milliards pts/s) [x${buildings['observatoire-temporel']}]`;

    updateButtonStates();
}


function updateCPSDisplay() {
    let cps = (buildings['cadran-solaire'] * 0.1) + (buildings['sablier'] * 1) + (buildings['horloge-a-coucou'] * 8) + (buildings['montre-de-poche'] * 47) + (buildings['calendrier-perpetuel'] * 260) + (buildings['reveil'] * 1400) + (buildings['tourdelhorloge'] * 7800) + (buildings['temple-du-temps'] * 40000) + (buildings['chronometre-universel'] * 260000) + (buildings['machine-a-remonter-le-temps'] * 1600000) + (buildings['spirale-temporelle'] * 10000000) + (buildings['station-temporelle'] * 65000000) + (buildings['astrolabe-mystique'] * 430000000) + (buildings['cristal-du-temps'] * 2900000000) + (buildings['observatoire-temporel'] * 21000000000);
    cpsDisplay.innerHTML = `
		<span>Points par seconde :</span><br>
		<span>${formatNumberWithAbbreviation(cps.toFixed(1))}</span>
	`;
}

function applyCPS() {
    let cps = (buildings['cadran-solaire'] * 0.1) + (buildings['sablier'] * 1) + (buildings['horloge-a-coucou'] * 8) + (buildings['montre-de-poche'] * 47) + (buildings['calendrier-perpetuel'] * 260) + (buildings['reveil'] * 1400) + (buildings['tourdelhorloge'] * 7800) + (buildings['temple-du-temps'] * 40000) + (buildings['chronometre-universel'] * 260000) + (buildings['machine-a-remonter-le-temps'] * 1600000) + (buildings['spirale-temporelle'] * 10000000) + (buildings['station-temporelle'] * 65000000) + (buildings['astrolabe-mystique'] * 430000000) + (buildings['cristal-du-temps'] * 2900000000) + (buildings['observatoire-temporel'] * 21000000000);
    counter += cps / 10;
    updateCounterDisplay();
    localStorage.setItem('clickCount', counter);
}

setInterval(() => {
    localStorage.setItem('clickCount', counter);
    localStorage.setItem('buildings', JSON.stringify(buildings));
    localStorage.setItem('trophies', JSON.stringify(trophies));
}, 5000);


const trophyList = document.getElementById('trophy-list');
displayTrophies();

const clickThresholds = [10, 50, 100, 1000, 10000, 100000, 1000000, 100000000, 10000000000];
const buildingThresholds = [1, 10, 50, 100, 500, 1000, 10000, 100000, 1000000];

setInterval(() => {
    localStorage.setItem('trophies', JSON.stringify(trophies));
}, 5000);

function displayTrophies() {
    trophyList.innerHTML = '';
    trophies.forEach(trophy => {
        const li = document.createElement('li');
        li.textContent = trophy;
        li.className = 'trophy';
        trophyList.appendChild(li);
    });
}

function addTrophy(trophyName) {
    if (!trophies.includes(trophyName)) {
        trophies.push(trophyName);
        console.log(`Nouveau trophée obtenu : ${trophyName}`);
        localStorage.setItem('trophies', JSON.stringify(trophies));
        displayTrophies();
    }
}


function checkForTrophies() {
    clickThresholds.forEach(threshold => {
        const trophyName = `Atteint ${formatNumberWithAbbreviationv2(threshold)} points`;
        if (counter >= threshold && !trophies.includes(trophyName)) {
            addTrophy(trophyName);
        }
    });

    Object.keys(buildings).forEach(building => {
        buildingThresholds.forEach(threshold => {
            const trophyName = `${threshold}x ${getBuildingName(building)}`;
            if (buildings[building] >= threshold && !trophies.includes(trophyName)) {
                addTrophy(trophyName);
            }
        });
    });
}

function getBuildingName(buildingId) {
    const buildingNames = {
        'cadran-solaire': 'Cadran Solaire',
        'sablier': 'Sablier',
        'horloge-a-coucou': 'Horloge à Coucou',
        'montre-de-poche': 'Montre de Poche',
        'calendrier-perpetuel': 'Calendrier Perpétuel',
        'reveil': 'Réveil',
        'tourdelhorloge': 'Tour de l’Horloge',
        'temple-du-temps': 'Machine à Remonter le Temps',
        'chronometre-universel': 'Chronomètre Universel',
        'machine-a-remonter-le-temps': 'Temple du Temps',
        'spirale-temporelle': 'Spirale Temporelle',
        'station-temporelle': 'Station Temporelle',
        'astrolabe-mystique': 'Astrolabe Mystique',
        'cristal-du-temps': 'Cristal du Temps',
        'observatoire-temporel': 'Observatoire Temporel'
    };
    return buildingNames[buildingId] || buildingId;
}

function buyBuilding(buildingId, cost, increment) {
    if (counter >= cost) {
        counter -= cost;
        buildings[buildingId]++;
        buildingPrices[buildingId] = Math.ceil(buildingPrices[buildingId] * 1.15);
        updateCounterDisplay();
        updateCPSDisplay();
        updateBuildingPrices();
        checkForTrophies();
        localStorage.setItem('clickCount', counter);
        localStorage.setItem('buildings', JSON.stringify(buildings));
        localStorage.setItem('buildingPrices', JSON.stringify(buildingPrices));
    } else {
        alert("Vous n'avez pas assez de points !");
    }
}

document.getElementById('b1').addEventListener('click', () => {
    buyBuilding('cadran-solaire', buildingPrices['cadran-solaire'], 0.1);
});

document.getElementById('b2').addEventListener('click', () => {
    buyBuilding('sablier', buildingPrices['sablier'], 1);
});

document.getElementById('b3').addEventListener('click', () => {
    buyBuilding('horloge-a-coucou', buildingPrices['horloge-a-coucou'], 8);
});

document.getElementById('b4').addEventListener('click', () => {
    buyBuilding('montre-de-poche', buildingPrices['montre-de-poche'], 47);
});

document.getElementById('b5').addEventListener('click', () => {
    buyBuilding('calendrier-perpetuel', buildingPrices['calendrier-perpetuel'], 260);
});

document.getElementById('b6').addEventListener('click', () => {
    buyBuilding('reveil', buildingPrices['reveil'], 1400);
});

document.getElementById('b7').addEventListener('click', () => {
    buyBuilding('tourdelhorloge', buildingPrices['tourdelhorloge'], 7800);
});

document.getElementById('b8').addEventListener('click', () => {
    buyBuilding('temple-du-temps', buildingPrices['temple-du-temps'], 40000);
});

document.getElementById('b9').addEventListener('click', () => {
    buyBuilding('chronometre-universel', buildingPrices['chronometre-universel'], 260000);
});

document.getElementById('b10').addEventListener('click', () => {
    buyBuilding('machine-a-remonter-le-temps', buildingPrices['machine-a-remonter-le-temps'], 1600000);
});

document.getElementById('b11').addEventListener('click', () => {
    buyBuilding('spirale-temporelle', buildingPrices['spirale-temporelle'], 10000000);
});

document.getElementById('b12').addEventListener('click', () => {
    buyBuilding('station-temporelle', buildingPrices['station-temporelle'], 65000000);
});

document.getElementById('b13').addEventListener('click', () => {
    buyBuilding('astrolabe-mystique', buildingPrices['astrolabe-mystique'], 430000000);
});

document.getElementById('b14').addEventListener('click', () => {
    buyBuilding('cristal-du-temps', buildingPrices['cristal-du-temps'], 2900000000);
});

document.getElementById('b15').addEventListener('click', () => {
    buyBuilding('observatoire-temporel', buildingPrices['observatoire-temporel'], 21000000000);
});

buyUpgradeButton.addEventListener('click', () => {
    const upgrade = upgrades[currentUpgradeIndex];
    if (counter >= upgrade.cost) {
        counter -= upgrade.cost;
        clickValue = upgrade.increment;
        currentUpgradeIndex++;
        localStorage.setItem('clickValue', clickValue);
        localStorage.setItem('currentUpgradeIndex', currentUpgradeIndex);
        updateCounterDisplay();
    }
    else {
        alert("Vous n'avez pas assez de points !");
    }
});

let buttonVisible = false;

function createRandomButton() {
    if (buttonVisible) {
        return;
    }

    const button = document.createElement('img');
    button.src = '../images/button.png';
    button.style.width = '100px';
    button.style.height = '100px';
    button.style.position = 'absolute';
    button.style.cursor = 'pointer';
    button.style.zIndex = "50";

    const goSound = new Audio('../musiques/go.mp3');
    goSound.play();

    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);
    button.style.left = `${Math.max(0, x)}px`;
    button.style.top = `${Math.max(0, y)}px`;

    buttonVisible = true;
    button.addEventListener('click', () => {
        if (Math.random() < 0.01) { // 1% de chance de reset
            counter = 0;
            showCustomAlert('Compteur réinitialisé !');
        } else {
            const addition = Math.random() < 0.5 ? 0.4 : 0.6;
            const additionValue = Math.floor(counter * addition);
            counter += additionValue;
            showCustomAlert(`+${formatNumber(additionValue)} points`);
        }

        updateCounterDisplay();
        localStorage.setItem('clickCount', counter);

        document.body.removeChild(button);
        buttonVisible = false;
    });

    document.body.appendChild(button);

    setTimeout(() => {
        if (document.body.contains(button)) {
            document.body.removeChild(button);
            buttonVisible = false;
        }
    }, 25000); // 25 secondes
}

function randomButtonGenerator() {
    const randomTime = Math.random() * 600000; // 10 minutes
    setTimeout(() => {
        createRandomButton();
        randomButtonGenerator();
    }, randomTime);
}

function showCustomAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.innerText = message;
    alertBox.style.position = 'fixed';
    alertBox.style.top = '10%';
    alertBox.style.left = '50%';
    alertBox.style.transform = 'translateX(-50%)';
    alertBox.style.padding = '10px 30px';
    alertBox.style.backgroundColor = '#4CAF50';
    alertBox.style.color = 'white';
    alertBox.style.fontSize = '40px';
    alertBox.style.borderRadius = '10px';
    alertBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    alertBox.style.transition = 'opacity 4s ease-in-out, transform 4s ease-in-out';
    alertBox.style.transform = 'translateX(-50%) translateY(40px)';
    alertBox.style.zIndex = '5';

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.style.opacity = '1';
        alertBox.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    setTimeout(() => {
        alertBox.style.opacity = '0';
        alertBox.style.transform = 'translateX(-50%) translateY(20px)';
        setTimeout(() => {
            document.body.removeChild(alertBox);
        }, 500);
    }, 3000);
}

randomButtonGenerator();


function updateUpgradeInfo() {
    if (currentUpgradeIndex < upgrades.length) {
        const upgrade = upgrades[currentUpgradeIndex];
        upgradeDescription.innerHTML = `Prochaine amélioration : <br>${upgrade.name} (${formatNumberWithAbbreviation(upgrade.cost)} points)`;
        buyUpgradeButton.disabled = counter < upgrade.cost;
    } else {
        upgradeDescription.textContent = "Toutes les améliorations ont été achetées.";
        buyUpgradeButton.disabled = true;
    }
}

document.getElementById('reset').addEventListener('click', () => {
    if (confirm("Êtes-vous sûr de vouloir rénitialiser votre partie ?"))
        counter = 0;
    clickValue = 1;
    currentUpgradeIndex = 0;
    buildings = {
        'cadran-solaire': 0,
        'sablier': 0,
        'horloge-a-coucou': 0,
        'montre-de-poche': 0,
        'calendrier-perpetuel': 0,
        'reveil': 0,
        'tourdelhorloge': 0,
        'machine-a-remonter-le-temps': 0,
        'chronometre-universel': 0,
        'temple-du-temps': 0,
        'spirale-temporelle': 0,
        'station-temporelle': 0,
        'astrolabe-mystique': 0,
        'cristal-du-temps': 0,
        'observatoire-temporel': 0
    };

    buildingPrices = {
        'cadran-solaire': 15,
        'sablier': 100,
        'horloge-a-coucou': 1100,
        'montre-de-poche': 12000,
        'calendrier-perpetuel': 130000,
        'reveil': 1400000,
        'tourdelhorloge': 20000000,
        'machine-a-remonter-le-temps': 330000000,
        'chronometre-universel': 5100000000,
        'temple-du-temps': 75000000000,
        'spirale-temporelle': 1000000000000,
        'station-temporelle': 14000000000000,
        'astrolabe-mystique': 170000000000000,
        'cristal-du-temps': 2100000000000000,
        'observatoire-temporel': 26000000000000000
    };
    let trophies = [];

    const trophyList = document.getElementById('trophy-list');
    if (trophyList) {
        trophyList.innerHTML = '';
    }
    localStorage.clear();
    updateCounterDisplay();
    updateCPSDisplay();
    updateBuildingPrices();
    updateUpgradeInfo();

    location.reload();
    location.reload();
});


updateCounterDisplay();
updateCPSDisplay();
updateBuildingPrices();
updateButtonStates();
updateUpgradeInfo();
setInterval(applyCPS, 100);




const SECRET_KEY = "FSg$Q$T%x7xKhU@EJjb3!"; 

const menuButton = document.createElement("button");
menuButton.textContent = "📁";
menuButton.style.position = "absolute";
menuButton.style.top = "55px";
menuButton.style.left = "212px";
menuButton.style.width = "37px";
menuButton.style.height = "38px";
menuButton.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
menuButton.style.color = "white";
menuButton.style.border = "1px solid white";
menuButton.style.borderRadius = "4px";
menuButton.style.transition = "background-color 0.3s ease";
menuButton.style.display = "flex";
menuButton.style.justifyContent = "center";
menuButton.style.alignItems = "center";
document.body.appendChild(menuButton);

const menuContainer = document.createElement("div");
menuContainer.style.position = "absolute";
menuContainer.style.top = "110%";
menuContainer.style.left = "0";
menuContainer.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
menuContainer.style.border = "1px solid white";
menuContainer.style.borderRadius = "4px";
menuContainer.style.display = "none";
menuContainer.style.flexDirection = "column";
menuContainer.style.gap = "5px";
menuContainer.style.padding = "8px";
menuContainer.style.zIndex = "100";
menuContainer.style.width = "80px";
menuContainer.style.textAlign = "center";

const saveButton = document.createElement("button");
saveButton.textContent = "💾 Save";
saveButton.style.width = "100%";
saveButton.style.backgroundColor = "black";
saveButton.style.color = "white";
saveButton.style.border = "1px solid white";
saveButton.style.padding = "5px";
saveButton.style.borderRadius = "4px";
saveButton.style.cursor = "pointer";
menuContainer.appendChild(saveButton);

const loadButton = document.createElement("button");
loadButton.textContent = "📂 Load";
loadButton.style.width = "100%";
loadButton.style.backgroundColor = "black";
loadButton.style.color = "white";
loadButton.style.border = "1px solid white";
loadButton.style.padding = "5px";
loadButton.style.borderRadius = "4px";
loadButton.style.cursor = "pointer";
menuContainer.appendChild(loadButton);

menuButton.appendChild(menuContainer);

menuButton.addEventListener("click", () => {
    menuContainer.style.display = menuContainer.style.display === "flex" ? "none" : "flex";
});

saveButton.addEventListener("click", () => {
    const data = {
        counter,
        clickValue,
        trophies,
        buildings,
        buildingPrices,
        currentUpgradeIndex
    };
    
    // 🔒 Chiffrement des données avec AES
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();

    const blob = new Blob([encryptedData], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "sauvegarde.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

const loadInput = document.createElement("input");
loadInput.type = "file";
loadInput.style.display = "none";
document.body.appendChild(loadInput);

loadButton.addEventListener("click", () => {
    loadInput.click();
});

loadInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                // 🔓 Déchiffrement AES
                const decryptedBytes = CryptoJS.AES.decrypt(e.target.result, SECRET_KEY);
                const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
                
                if (!decryptedData) throw new Error("Déchiffrement échoué");

                const loadedData = JSON.parse(decryptedData);

                counter = loadedData.counter || 0;
                clickValue = loadedData.clickValue || 1;
                trophies = loadedData.trophies || [];
                buildings = loadedData.buildings || {};
                buildingPrices = loadedData.buildingPrices || {};
                currentUpgradeIndex = loadedData.currentUpgradeIndex || 0;

                localStorage.setItem("clickCount", counter);
                localStorage.setItem("clickValue", clickValue);
                localStorage.setItem("trophies", JSON.stringify(trophies));
                localStorage.setItem("buildings", JSON.stringify(buildings));
                localStorage.setItem("buildingPrices", JSON.stringify(buildingPrices));
                localStorage.setItem("currentUpgradeIndex", currentUpgradeIndex);

                updateCounterDisplay();
                updateCPSDisplay();
                updateBuildingPrices();
                updateUpgradeInfo();

                location.reload();

            } catch (error) {
                alert("Erreur lors du chargement ou du déchiffrement du fichier");
            }
        };
        reader.readAsText(file);
    }
});
