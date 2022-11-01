




var ccahs_uti = {
    gen_table: function (obj) {
        ccahs_uti.m_obj = obj
        ccahs_uti.gen_tab_elm(obj)
        ccahs_uti.gen_tab_evt()
    },
    gen_tab_evt: function () {
        $("td").on("click", function () {
            $(this).toggleClass("hili")
        })

        $("textarea").on("click", function () {
            ccahs_uti.get_editable_dat_from_table()
        })

    },
    gen_tab_elm: function (obj) {
        var stb = "<table border='1'><thead><tr><th>#</th><th>Item</th><th>Desc</th></tr></thead><tbody>"
        var ar = Object.keys(obj)
        ar.forEach(function (key, i) {
            stb += `<tr><td>${1 + i}</td><td>${key}</td><td contenteditable='true' id='${key}'>${obj[key]}</td></tr>`


        })
        stb += `</tbody></table>`
        var e = document.createElement("div")
        e.innerHTML = (stb)
        var ta = document.createElement("textarea")


        document.getElementsByTagName("body")[0].appendChild(e).appendChild(ta)
    },

    get_editable_dat_from_table: function () {
        var obj = ccahs_uti.m_obj
        var ar = Object.keys(obj)
        ar.forEach(function (key, i) {
            var txt = document.getElementById(key).innerHTML
            obj[key] = txt
        })
        var str = JSON.stringify(obj, null, 4)
        $("textarea")[0].value = str
    }


}





















