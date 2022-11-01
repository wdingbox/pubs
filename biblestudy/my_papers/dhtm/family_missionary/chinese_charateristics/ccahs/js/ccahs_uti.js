




var ccahs_uti = {
    gen_tab: function (obj) {
        ccahs_uti.gen_tab_elm(obj)
        ccahs_uti.gen_tab_evt()
    },
    gen_tab_evt: function () {
        $("td").on("click",function(){
            $(this).toggleClass("hili")
        })
        
    },
    gen_tab_elm: function (obj) {
        var stb = "<table border='1'><thead><tr><th>#</th><th>Item</th><th>Desc</th></tr></thead><tbody>"
        var ar = Object.keys(obj)
        ar.forEach(function (key, i) {
            stb += `<tr><td>${1+i}</td><td>${key}</td><td contenteditable>${obj[key]}</td></tr>`


        })
        stb += `</tbody></table>`
        var e = document.createElement("div")
        e.innerHTML = (stb)

        document.getElementsByTagName("body")[0].appendChild(e)
    },


}





















