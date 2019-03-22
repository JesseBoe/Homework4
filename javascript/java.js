$(document).ready(function () {


    //Player variables
    var playerName = "";
    var playerHealth = 0;
    var imagePath = "";
    var playerAttack = 0;
    var playerAttackR = 0;
    var playerChildObjects = [];
    var baseAttack;
    var alive = true;
    //Enemy variables
    var enemyName = "";
    var enemyHealth = 0;
    var enemyPath = "";
    var enemyAttack = 0;
    var enemySpeed = 0;
    //Gamestates
    var PickingCharacter = true;
    var PickingOpponent = false;
    var Fighting = false;
    var EnemiesDefeated = 0;
    //Timer
    var intervalId;


    $(".char").on("click", function () {
        if (alive) {
            if (PickingCharacter) {
                PickingCharacter = false;

                // Clear the player's old spot
                var temp = ClearSpot($(this));
                // Set player stats
                playerName = temp[0];
                imagePath = temp[1];
                playerHealth = temp[2];
                playerAttack = temp[3];
                playerAttackR = temp[4];
                baseAttack = playerAttack;

                // Move the player
                playerChildObjects = $('#PlayerZone').children();
                $('#PlayerZone').attr('class', 'activeChar');
                $(playerChildObjects[0]).text(playerName);
                $(playerChildObjects[1]).attr('src', imagePath)
                $(playerChildObjects[2]).text(playerHealth);

                PickingOpponent = true;
            }

            else if (PickingOpponent) {
                if ($(this).attr('class') == "empty") {

                }
                else {
                    PickingOpponent = false;
                    SelectEnemy(ClearSpot($(this)));
                    if (!Fighting) {
                        intervalId = setInterval(EnemyAttack, enemySpeed);
                    }
                    Fighting = true;
                }
            }
        }
    })

    $("#EnemyZone").on("click", function () {
        if (alive) {
            if (Fighting) {
                var num = Math.floor(Math.random() * playerAttackR);
                num += + playerAttack;
                enemyHealth -= num;
                $(this).children()[2].textContent = enemyHealth;
                FloatingNumber(num, true);
                if (enemyHealth <= 0) {
                    ClearSpot($(this));
                    Fighting = false;
                    clearInterval(intervalId);
                    PickingOpponent = true;
                    EnemiesDefeated++;
                    LevelUp();
                    CheckWinstate();
                }
            }
        }
    })

    function CheckWinstate() {
        if (EnemiesDefeated >= 7) {
            alert("You win!!");
        }
    }

    function EnemyAttack() {
        playerHealth -= enemyAttack;
        FloatingNumber(enemyAttack, false);
        $(playerChildObjects[2]).text(playerHealth);
        if (playerHealth <= 0) {
            alive = false;
            clearInterval(intervalId);
            ClearSpot($('#PlayerZone'));
        }
    }

    function FloatingNumber(int, attackingEnemy) {
        var num = $('<p class= floatingNumber>' + int + '</p>');
        if (attackingEnemy) {
            $('#EnemyZone').append(num);
        }
        else {
            $('#PlayerZone').append(num);
        }
        num.animate({ "top": "-=50px" }, '1500');
        num.animate({ 'opacity': '0' }, '300');
    }

    function SelectEnemy(temp) {
        enemyName = temp[0];
        enemyPath = temp[1];
        enemyHealth = temp[2];
        enemyAttack = temp[5];
        enemySpeed = temp[6];


        var enemyChildObjects = $('#EnemyZone').children();
        $('#EnemyZone').attr('class', 'activeChar');
        $(enemyChildObjects[0]).text(enemyName);
        $(enemyChildObjects[1]).attr('src', enemyPath);
        $(enemyChildObjects[2]).text(enemyHealth);
    }

    function LevelUp() {
        playerAttack = parseInt(baseAttack) + parseInt(EnemiesDefeated);
    }

    function ClearSpot(Char) {
        var temp = [];
        var tempChildObjets = Char.children();
        temp[0] = Char.attr('name');
        temp[1] = $(tempChildObjets[1]).attr('src');
        temp[2] = Char.attr('health');
        temp[3] = Char.attr('attack');
        temp[4] = Char.attr('attackR');
        temp[5] = Char.attr('enemyAttack');
        temp[6] = Char.attr('speed');
        $(tempChildObjets[0]).text("");
        $(tempChildObjets[1]).attr('src', "images/Empty.png")
        $(tempChildObjets[2]).text('');
        Char.attr('class', 'empty');
        return temp;
    }
});