let cards = []

class PlayingCard extends GameObject {
    constructor(...props) {
        super(...props);

        this.cardBack = images['card_back_hometeam_logo'];
        this.cardFace = images['card_heart_ace'];
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