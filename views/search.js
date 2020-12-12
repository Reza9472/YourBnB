window.onload = function(){

    let submitButton = document.getElementById("subBut");
    let countryList = document.getElementById("location");
    let cardLocation = document.querySelectorAll("h6");
    var card = document.getElementsByClassName("card");
    let clearBut = document.getElementById("clear");

   

    submitButton.addEventListener("click" , function(){
        
        
        let collection = countryList.selectedOptions;
        var x = document.getElementById("listCard").querySelectorAll("h6");

        for(let r=0 ; r < x.length ; r++){
            card[r].style.display = "block";
        }
        for(let j = 0 ; j < collection.length ; j++){
            if(collection[j].innerHTML === "Toronto"){

                
                for(let i = 0 ; i < x.length ; i++){
                    if(x[i].innerHTML !== "Toronto"){
                        card[i].style.display = "none";
                    }
                }
                

                
            }
            else if(collection[j].innerHTML === "Ottawa"){
               
                for(let i = 0 ; i < x.length ; i++){
                    if(x[i].innerHTML !== "Ottawa"){
                        card[i].style.display = "none";
                    }
                }
            }
            else if (collection[j].innerHTML === "Montreal"){
                
                for(let i = 0 ; i < x.length ; i++){
                    if(x[i].innerHTML !== "Montreal"){
                        card[i].style.display = "none";
                    }
                }
            }
        }

       
      
        
    } , false);


    clearBut.addEventListener("click" , function(){
        let x = document.querySelectorAll(".card");

        for (let i = 0 ; i < x.length ; i++){
            card[i].style.display = "block";
        }
    });



    // ----------------------------------------------------------------------------------------------------------------------------

    // // The Book Now Form

    // function CalcDays(){
    //     var inDate = new Date(document.getElementById("indate").value);
    //     var outDate = new Date(document.getElementById("outdate").value);
    //     return parseInt((outDate - inDate) / (24 * 3600 * 1000));
    // }

    // function calculate(){

    //     if(document.getElementById("outdate")){
    //         alert("HEllo");
    //         document.getElementById("numdays").value = CalcDays();
    //     }
    // }


    // ----------------------------------------------------------------------------------------------------------------------------


    $(document).ready( function() {
        var templateSource = $("#details-template").html();
        var template = Handlebars.compile(templateSource);
            $('#booksub').click(function(){
                    $("#detailsBox").html(template({"indate":$('#indate').val(), "outdate":$('#outdate').val()}));
            });
        });
    

    
}
