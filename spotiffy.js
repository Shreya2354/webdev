console.log('this is java script');
let currentsong = new Audio();
let song;
let currfolder;

function secondstominutesseconds(seconds) { //to get the time of the song and the playing duration 
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }


    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');


    return `${formattedMinutes}:${formattedSeconds}`;
}





async function getsongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div");
    div.innerHTML = response;

    let as = div.getElementsByTagName("a");
    song = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            song.push(element.href.split(`/${folder}/`)[1])
        }

    }
    //show all the songs in the playlist and to display song under the card//
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0] //using these three we get the name of the songs in library//
    songul.innerHTML = " "
    for (const songs of song) {
        songul.innerHTML = songul.innerHTML + `<li><img  class="invert" src="img/music.svg" alt="">
        <div class="info">
        <div> ${songs.replaceAll("%20", " ")} </div>
       
        </div>
        <div class="playnow">
        <span>Play Now</span>
        <img class="invert" src="img/play.svg" alt="">
        </div></li>` ;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })




}
const playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track //to make the song play by selecting//
    if (!pause) {
        currentsong.play()
        play.src = "img/pauuse.svg"
    }
    //to make the playing song stop//
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function displayalbums() {
    console.log("displaying album")
    let a = await fetch(`http://127.0.0.1:3000/song`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/song")) {
            let folder = e.href.split("/").slice(-2)[0]
            //get the met data of the folder
            let a = await fetch(`http://127.0.0.1:3000/song/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" height="190px" class="card" >
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"
                                color="#000000" fill="#000">
                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/song/${folder}/copy.jpg	"  alt="">
                        <h2>${response.title}</h2>

                        <p>${response.description}</p>

                    </div>`


        }

    }
    //load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            song = await getsongs(`song/${item.currentTarget.dataset.folder}`)
            playmusic(song[0])
        })
    })

}






async function main() {
    // get the list of songs
    await getsongs("song/nc")

    playmusic(song[0], true)
    //console.log(song)

    //var audio=new Audio(song[0]); /*these both help in playing a */
    // audio.play();
    /* the audio*/





    //display all the album on the page
    await displayalbums()





    //audio.addEventListener("loadeddata", () => { //using these three we only play the song once 

    //console.log(audio.duration,audio.currentSrc,audio.currentTime);
    // The duration variable now holds the duration (in seconds) of the audio clip
    // });


    //dsiplay all the event listener to play,next and previous

    play.addEventListener("click", () => { // to male the song play while selectiing and pause while selcting the pause button
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pauuse.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"

        }
    })
    //listen for timeupdate event
    currentsong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondstominutesseconds(currentsong.currentTime)}/${secondstominutesseconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    //add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100


    })
    //add an event listener to hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })


    //add an event listener to close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    //add an event listener for prev and next
    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("Previous clicked")
        let index = song.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(song[index - 1])


        }
    })

    next.addEventListener("click", () => {
        currentsong.pause()
        console.log("Next clicked")

        let index = song.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(index)
        if ((index + 1) < song.length) {
            playmusic(song[index + 1])


        }
    })
    //add an event to volume(adjusting)//
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/100")
        currentsong.volume = parseInt(e.target.value) / 100
    })
    //add eventlistener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target.src)
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })






}





main()


