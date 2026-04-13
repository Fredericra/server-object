import { defineField,defineType } from "@sanity/types";


export default defineType({
    name: "header",
    title: "Header",
    type: "document",
    fields: [
        defineField({
            name: "name",
            title: "Title",
            type: "string",
        }),
        defineField({
            name: "description",
            title: "Description",
            type: "text",
        }),
        defineField({
            name: "imageUrl",
            title: "Image URL",
            type: "string",
        }),
    ],  
})