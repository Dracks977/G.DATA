$(function() {
    $("#auto").autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "/api/character/search/" + $("#auto").val(),
                dataType: "json",
                data: {
                    searchText: request
                },
                success: function(data) {
                    response($.map(data, function(item) {
                        // if (item.type == "character") {
                            return {
                                label: item.name,
                                value: item.name,
                                id: item.id
                            };
                        // s
                    }));
                },

            });
        },
        select: function(event, ui) {
            if (ui.item) {
                $(event.target).val(ui.item.value);
                $('#cid').val(ui.item.id)
            }
        },
        minLength: 3,
        appendTo: "#charauto",

    }).data("ui-autocomplete")._renderItem = function(ul, item) {
        return $("<li>")
            .append('<div class="ui-menu-item-wrapper" cid=' + item.id + '>' + item.label + '</div>')
            .appendTo(ul);
    };


});