let cards = []
const cardImages = [
    'card_club_10',
    'card_club_ace',
    'card_club_jack',
    'card_club_king',
    'card_club_queen',
    'card_diamond_10',
    'card_diamond_ace',
    'card_diamond_jack',
    'card_diamond_king',
    'card_diamond_queen',
    'card_heart_10',
    'card_heart_ace',
    'card_heart_jack',
    'card_heart_king',
    'card_heart_queen',
    'card_spade_10',
    'card_spade_ace',
    'card_spade_jack',
    'card_spade_king',
    'card_spade_queen'
]

class PlayingCard extends GameObject {
    constructor(...props) {
        super(...props);

        this.cardBack = images['card_back_hometeam_logo'];
        this.cardFace = images[cardImages[Math.floor(Math.random() * cardImages.length)]];
        this.spin = 0;
        this.isSpinning = false;
        this.isFaceUp = false;
        this.score = 1000;

        cards.push(this);
    }

    update (deltaTime) {

        super.update(deltaTime);
        if(this.isSpinning){

            this.spin += deltaTime * 0.002;

            if (Math.cos(this.spin) < -0.9){
                this.spin = Math.PI;
                this.isSpinning = false;
                this.isFaceUp = true;

                if (this.areAllCardsFaceUp()){
                    SceneManager.scenes[SCENE.GAME].incrementScoreFromObject(this.score);
                }
            }
        }
    }

    flipCard(){
        this.isSpinning = true;
    }

    areAllCardsFaceUp(){

        for (const card of cards){
            if (!card.isFaceUp){
                return false;
            }
        }

        return true;
    }

    draw(){
        drawImageForTiledWithVerticalSpin(this.cardFace, this.cardBack, this.x, this.y, this.spin);
    }
}