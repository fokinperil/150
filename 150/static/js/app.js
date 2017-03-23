var profile_transition_end = function (e) {
    console.log("Profile transition ended.");
    document.getElementById("member-profile-overlay").style.zIndex = "-1";
    e.currentTarget.removeEventListener("transitionend", profile_transition_end, false);
}

var profile_view = function () {
    var overlay = document.getElementById("member-profile-overlay");
    var profile = document.getElementById("member-profile");
    overlay.style.zIndex = '2';
    overlay.style.opacity = "1";

    profile.classList.remove("profile-appear");
    profile.classList.remove("profile-disappear");
    profile.offsetWidth;
    profile.classList.add("profile-appear");
}

var profile_close = function () {
    var overlay = document.getElementById("member-profile-overlay");
    var profile = document.getElementById("member-profile");
    overlay.addEventListener("transitionend", profile_transition_end, false);
    overlay.style.opacity = "0";

    profile.classList.remove("profile-appear");
    profile.classList.remove("profile-disappear");
    profile.offsetWidth;
    profile.classList.add("profile-disappear"); 
}

var listing = document.getElementById("listing");

listing.addEventListener("mouseleave", function (e) { e.currentTarget.style.display = "none"; }, false);

var tab_m_enter = function (e) {
    console.log(e);
    console.log("Mouse enter on tab");
    console.log(e.currentTarget);
    listing.style.left = e.currentTarget.offsetLeft + "px";
    listing.style.top = (e.currentTarget.offsetHeight - 3) + "px";

    var l_width = parseInt(e.currentTarget.offsetWidth) < 300 ? 300 : e.currentTarget.offsetWidth;
    listing.style.width = l_width + "px";
    listing.style.display = "flex";

    listing.classList.remove("listing-appear");
    void listing.offsetWidth;
    listing.classList.add("listing-appear");
}

var tab_m_leave = function (e) {
    console.log(e);
    console.log("Mouse leave on tab");

    if ( !e.relatedTarget || e.relatedTarget.id != "listing" )
        listing.style.display = "none";
}

var tabs = document.getElementsByClassName("top-bar-tab");
for ( var i=0; i < tabs.length; i++ ) {
    console.log("Loop");
    tabs[i].addEventListener("mouseenter", tab_m_enter, false);
    tabs[i].addEventListener("mouseleave", tab_m_leave, false);
}

var glob_v_handle = false;

var v_handle = document.getElementById("volume-handle");
var v_line = document.getElementById("volume-line");
var v_icon = document.getElementById("volume-icon").getElementsByTagName("I")[0];
var v_value = 0;
var mute_resume_v = 0.2;

var mute = function () {
    if ( v_value > 0 ) {
        var v_line_bound = v_line.getBoundingClientRect();
        v_handle.style.top = v_line_bound.height + "px";
        v_icon.innerHTML = "&#xea85";
        mute_resume_v = v_value;
        v_value = 0;

        document.getElementById("volume-active").style.height = Math.round(v_value * 100) + "%";
    }
    else {
        console.log("Resume volume at ", mute_resume_v);
        var v_line_bound = v_line.getBoundingClientRect();
        var v_pos = v_line_bound.height - (v_line_bound.height * mute_resume_v);
        console.log("Resume pos at ", v_pos);
        v_handle.style.top = v_pos + "px";
        v_value = mute_resume_v;

        document.getElementById("volume-active").style.height = Math.round(v_value * 100) + "%";
        
        
        switch ( true ) {
            case !mute_resume_v:
                v_icon.innerHTML = "&#xea85";
                break;
            
            case mute_resume_v > 0 && mute_resume_v < 0.25:
                v_icon.innerHTML = "&#xe8b0";
                break;

            case mute_resume_v > 0.25 && mute_resume_v <= 0.5:
                v_icon.innerHTML = "&#xe8b1";
                break;

            default:
                v_icon.innerHTML = "&#xe8b2";
                break;
        }

        mute_resume_v = 0;
    }

    audio.volume = v_value;
}

var update_volume = function () {
    console.log("Update volume");
    var p = v_handle.offsetTop;
    p = p < 0 ? 0 : p;

    var limit = v_line.offsetHeight - 13;
    console.log("p: ", p, ", limit: ", limit);
    var volume = 1 - (p / limit);
    volume = volume < 0 ? 0 : volume;

    audio.volume = volume;

    document.getElementById("volume-active").style.height = Math.round(volume * 100) + "%";

    switch ( true ) {
        case !volume:
            v_icon.innerHTML = "&#xea85";
            break;
        
        case volume > 0 && volume < 0.25:
            v_icon.innerHTML = "&#xe8b0";
            break;

        case volume > 0.25 && volume <= 0.5:
            v_icon.innerHTML = "&#xe8b1";
            break;

        default:
            v_icon.innerHTML = "&#xe8b2";
            break;
    }

    v_value = volume;
    console.log("Volume: ", volume);
}

v_line.addEventListener("mousedown", function(e) {
    var v_line_bound = v_line.getBoundingClientRect();
    if ( e.clientY > v_line_bound.top && e.clientY < v_line_bound.bottom )
        v_handle.style.top = (e.clientY - v_line_bound.top) + "px";
    update_volume();
})

v_handle.addEventListener("dragstart", function (e) {
   console.log("Drag");
   e.preventDefault();
}, false);

v_handle.addEventListener("mousedown", function() { 
    console.log("Handling volume"); 
    glob_v_handle = true; 
}, false);

document.addEventListener("mouseup", function() { 
    if ( glob_v_handle ) {
      glob_v_handle = false; 
      console.log("Not handling volume anymore"); 
    }
}, false);

document.addEventListener("mousemove", function(e) {
    if ( glob_v_handle ) {
      var v_line_bound = v_line.getBoundingClientRect();
      console.log("Adjusting volume.");
      
      console.log("cursor top: ", e.clientY, ", v_handle offsetTop: ", v_handle.offsetTop, ", anchor top: ", v_line_bound.top, "anchor bottom: ", v_line_bound.bottom);
      
      if ( e.clientY > v_line_bound.top + 7 && e.clientY < v_line_bound.bottom ) {
        v_handle.style.top = (e.clientY - v_line_bound.top) + "px";
        update_volume();
      }
    }
}, false);


var disp_members = function () {
    var members = document.getElementsByClassName("member");
    for ( var i=0; i < members.length; i++ ) {
        members[i].classList.remove("member-appear");
        void members[i].offsetWidth;
        members[i].classList.add("member-appear");
    }
}

var galaxy_mouse_move = function (e) {
    var mv_x = Math.round(e.clientX / 7);
    var mv_y = Math.round(e.clientY / 7);
    e.currentTarget.getElementsByClassName("member-overlay-galaxy")[0].style.backgroundPosition =  -mv_x + "px " + -mv_y + "px";
}

var galaxy_overlay_effect = function () {
    var galaxies = document.getElementsByClassName("member-overlay");
    for ( var i=0; i < galaxies.length; i++ ) 
        galaxies[i].addEventListener("mousemove", galaxy_mouse_move, false);
}

galaxy_overlay_effect();
disp_members();

var audio = document.getElementById("player");
mute();