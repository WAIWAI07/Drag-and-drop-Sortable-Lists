/**
 * @description This is a class used to create a drag-and-drop sortable lists
 */
class DraggableList {
    /**
     * 
     * @description Create a DraggableList object
     * @param {HTMLElement} parent The parent container of the drag-and-drop sortable lists
     */
    constructor (parent, item_styles) {
        this.parent = parent
        this.ghost_items = () => document.getElementsByClassName("ghost-item")
        this.parent_styles = {}
        this.item_styles = {}
        this.drag_item_viewer_styles = {}
        this.ghost_item_styles = {}

        this.global_df_styles = {
            padding: "10px",
            fontFamily: "Helvetica",
            fontSize: "20px",
            borderRadius: "99999px",
            transitionDuration: "150ms",
            userSelect: "none",
            textAlign: "center",
            width: "300px",
        }
        
        this.df_parent_styles = {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            fontSize: "20px",
            fontFamily: "Helvetica",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            borderRadius: "12px",
            transition: "150ms",
            width: "fit-content",
        }

        this.df_item_styles = {
            ...this.global_df_styles,
            backgroundColor: "#fff",
            cursor: "grab",
            boxShadow: "1px 1px 3px #00000015",
        }

        this.df_drag_item_viewer_styles = {
            ...this.global_df_styles,
            backgroundColor: "#cccccc90",
            backdropFilter: "blur(9px)",
            boxShadow: "1px 1px 3px #00000015",
            pointerEvents: "none",
            position: "absolute",
            top: "50%",
            left: null,
            transform: "translate(-50%, -50%)",
            zIndex: "2",
            opacity: "0",
        }

        this.df_ghost_item_styles = {
            ...this.global_df_styles,
            backgroundColor: "#fff",
            boxShadow: "1px 1px 3px #00000015",
            position: "absolute",
            left: null,
            transform: "translate(-50%, -50%)",
            zIndex: "1",
            pointerEvents: "none",
            opacity: "0",
        }

        this.set_item_styles(this.df_item_styles)
        this.set_parent_styles(this.df_parent_styles)

        this.import_css_styles()

        this.set_item_draggable()
        this.set_df_item_classes()

        this.set_drag_event_listeners()

        this.check_parent_center_x()
    }

    /**
     * @description Get the center x of the parent element
     */
    check_parent_center_x() {
        setTimeout(() => {
            this.parent_center_x = this.parent.children[0].getBoundingClientRect().left + this.parent.children[0].getBoundingClientRect().width / 2
            this.df_drag_item_viewer_styles.left = `${this.parent_center_x}px`
            this.df_ghost_item_styles.left = `${this.parent_center_x}px`

            this.set_drag_item_viewer_styles({
                left: `${this.parent_center_x}px`,
            })
            this.set_ghost_item_styles({
                left: `${this.parent_center_x}px`,
            })
        }, 200)
    }
    
    /**
     * @description Import the default CSS styles from the built in CSS static file
     */
    import_css_styles() {
        // Create the link element object
        let link = document.createElement("link")
        link.rel = "stylesheet"
        link.type = "text/css"
        link.href = "./drag_sort_list.css"

        // Append to the head element
        document.getElementsByTagName("head")[0].appendChild(link)
    }

    /**
     * @description Set the item styles in the parent container
     * @param {{[key:string]: string}} item_styles The style of the item
     */
    set_item_styles(item_styles) {
        Object.assign(this.item_styles, item_styles)

        for (const [style, value] of Object.entries(this.item_styles)) {
            for (const item of Array.from(this.parent.children)) {
                item.style[style] = value
            }
        }
    }

    /**
     * @description Set the item 'draggable' attribute to 'true'
     */
    set_item_draggable() {
        for (const item of Array.from(this.parent.children)) {
            item.setAttribute("draggable", "true")
        }
    }

    /**
     * @description Set the default item class attributes (for applying CSS styles and JavaScript)
     */
    set_df_item_classes() {
        for (const item of Array.from(this.parent.children)) {
            for (const class_name of ["draggable-item"]) {
                item.classList.add(class_name)
            }
        }
    }

    /**
     * @description Set the item styles in the parent container
     * @param {{[key:string]: string}} parent_styles The style of the parent
     */
    set_parent_styles(parent_styles) {
        Object.assign(this.parent_styles, parent_styles)

        for (const [style, value] of Object.entries(this.parent_styles)) {
            this.parent.style[style] = value
        }
    }

    /**
     * @description Set the item styles in drag item viewer
     * @param {{[key:string]: string}} drag_item_viewer_styles The style of the drag item viewer
     */
    set_drag_item_viewer_styles(drag_item_viewer_styles) {
        Object.assign(this.drag_item_viewer_styles, drag_item_viewer_styles)

        for (const [style, value] of Object.entries(this.drag_item_viewer_styles)) {
            this.drag_item_viewer.style[style] = value
        }

        this.check_parent_center_x()
    }

    /**
     * @description Set the ghost item styles
     * @param {{[key:string]: string}} ghost_item_styles The style of the ghost item
     * @param {HTMLElement} ghost_item (optional) The ghost item element
     */
    set_ghost_item_styles(ghost_item_styles, ghost_item = null) {
        Object.assign(this.ghost_item_styles, ghost_item_styles)

        if (ghost_item) {
            for (const [style, value] of Object.entries(this.ghost_item_styles)) {
                ghost_item.style[style] = value
            }
        }

        for (const [style, value] of Object.entries(this.ghost_item_styles)) {
            for (const ghost_item of Array.from(this.ghost_items())) {
                ghost_item.style[style] = value
            }
        }

        this.check_parent_center_x()
    }
    
    /**
     * @description Set the drag event listeners
     */
    set_drag_event_listeners() {
        // Set the drag item viewer
        this.drag_item_viewer = document.createElement("div")

        // Set the styles of the drag item viewer
        this.set_drag_item_viewer_styles(this.df_drag_item_viewer_styles)

        // Add the drag item viewer to the body
        document.body.appendChild(this.drag_item_viewer)


        // Functions

        /**
         * @description Get the center y of an element
         * @param {HTMLElement} elem The element to get the center y
         */
        function get_elem_centery (elem) {
            let elem_top = elem.getBoundingClientRect().top
            let elem_height = elem.getBoundingClientRect().height
            return elem_top + elem_height / 2
        }

        /**
         * @description Get the index of an element
         * @param {HTMLElement} parent The parent element
         * @param {HTMLElement} elem The element to get the index of
         */
        function get_item_index (parent, elem) {
            return Array.from(parent.children).indexOf(elem)
        }

        /**
         * @description Create a ghost item
         * @param {HTMLElement} item_elem The item element
         * @param {{[key:string]: string}} item_styles The style of the item
         */
        function create_ghost_item (item_elem, item_styles) {
            // Create the ghost item
            let ghost_item = item_elem.cloneNode(true)

            // Remove all styles from the ghost item
            for (const [style, value] of Object.entries(item_styles)) {
                ghost_item.style[style] = ""
            }

            // Remove all classes from the ghost item
            for (const class_name of Array.from(item_elem.classList)) {
                ghost_item.classList.remove(class_name)
            }

            // Set the attributes and classes of the ghost item
            ghost_item.setAttribute("draggable", "false")
            ghost_item.classList.remove("draggable-item")
            ghost_item.classList.add("ghost-item")

            // Set the top position of the ghost item
            ghost_item.style.top = `${get_elem_centery(item_elem)}px`
            
            return ghost_item
        }

        /**
         * @description Remove all ghost items
         * @param {NodeListOf<HTMLElement>} ghost_items The ghost items
         */
        function remove_ghost_items (ghost_items) {
            // Remove all ghost items
            for (const ghost of Array.from(ghost_items)) {
                document.body.removeChild(ghost)
            }
        }


        // Add mouse over event on the parent element
        this.parent.addEventListener("mouseover", (event) => {
            // If the event target is parent, then return null
            if (event.target == this.parent) return

            // Set the position of the drag item viewer
            this.set_drag_item_viewer_styles({
                top: `${get_elem_centery(event.target)}px`
            })
        })

        // Drag events

        // Add drag start event on the parent element
        this.parent.addEventListener("dragstart", (event) => {
            // If the event target is parent, then return null
            if (event.target == this.parent) return

            // Set the event data transfer data and drag image
            event.dataTransfer.setData("text/plain", event.target.id)
            event.dataTransfer.setDragImage(new Image, 0, 0)

            // Set the drag target
            this.drag_target = event.target

            // Set the position of the drag item viewer
            this.set_drag_item_viewer_styles({
                top: `${get_elem_centery(this.drag_target)}px`
            })

            // Set the opacity of the dragging item to 0
            this.drag_target.style.opacity = "0"

            // Set the opacity of the drag item viewer to 1 and set its innerHTML to the innerHTML of the event target
            setTimeout(() => {
                this.set_drag_item_viewer_styles({
                    opacity: "1"
                })
                this.drag_item_viewer.innerHTML = this.drag_target.innerHTML
            })

            // Create the ghost items
            for (let item of Array.from(this.parent.children)) {
                let ghost_item = create_ghost_item(item, this.item_styles)

                // Set the styles of the ghost items
                this.set_ghost_item_styles(this.df_ghost_item_styles, ghost_item)

                // Add the ghost item to the body
                document.body.appendChild(ghost_item)
            }

            // Set all ghost items to opacity 1
            this.set_ghost_item_styles({
                opacity: "1"
            })

            // Set the dragging ghost item
            this.dragging_ghost_item = this.ghost_items()[get_item_index(this.parent, this.drag_target)]
        })

        // Add drag over event on the parent element
        this.parent.addEventListener('dragover', (event) => {
            event.preventDefault()
        })

        // Add drag enter event on the parent element
        this.parent.addEventListener('dragenter', (event) => {
            // If the event target is parent, then return null
            if (event.target == this.parent) return

            // Set the drop target
            this.drop_target = event.target

            // Set the position of the drag item viewer
            this.set_drag_item_viewer_styles({
                top: `${get_elem_centery(this.drop_target)}px`
            })

            // Set the tops of the dragging ghost item and the drop point item
            let dragging_ghost_item_top = this.dragging_ghost_item.getBoundingClientRect().top
            let drop_target_top = Array.from(this.parent.children)[get_item_index(this.parent, this.drop_target)].getBoundingClientRect().top

            // Move the ghost items
            if (dragging_ghost_item_top > drop_target_top) {
                // The above ghost item
                let below_point_y = get_elem_centery(this.dragging_ghost_item)
                this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item) - 1].style.top = `${below_point_y}px`

                // The below ghost item
                let above_point_y = get_elem_centery(Array.from(this.parent.children)[get_item_index(this.parent, this.drop_target)])
                this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item)].style.top = `${above_point_y}px`

                document.body.insertBefore(this.dragging_ghost_item, this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item) - 1])
            } else if (dragging_ghost_item_top < drop_target_top) {
                // The below ghost item
                let above_point_y = get_elem_centery(this.dragging_ghost_item)
                this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item) + 1].style.top = `${above_point_y}px`

                // The above ghost item
                let below_point_y = get_elem_centery(Array.from(this.parent.children)[get_item_index(this.parent, this.drop_target)])
                this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item)].style.top = `${below_point_y}px`

                document.body.insertBefore(this.dragging_ghost_item, this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item) + 2])
            }
        })

        // Add drag over event on the parent element
        this.parent.addEventListener('dragover', (event) => {
            event.preventDefault()
        })

        // Add drop event on the body element
        document.body.addEventListener('drop', (event) => {
            event.preventDefault()

            // Remove the ghost items
            remove_ghost_items(this.ghost_items())
        })

        // Add drag end event on the body element
        document.body.addEventListener('dragend', (event) => {
            // If the drag target idx is greater than the drop target idx, then insert the drag target before the drop target
            if (get_item_index(this.parent, this.drag_target) > get_item_index(this.parent, this.drop_target)) {
                this.parent.insertBefore(this.drag_target, this.drop_target)
            } else if (get_item_index(this.parent, this.drag_target) < get_item_index(this.parent, this.drop_target)) {
                // If the drag target idx is less than the drop target idx, then insert the drag target after the drop target
                this.parent.insertBefore(this.drag_target, this.drop_target.nextSibling)
            }

            // Set the opacity of the dragging item to 1
            this.drag_target.style.opacity = "1"

            // Set the opacity of the drag item viewer to 0
            this.set_drag_item_viewer_styles({
                opacity: "0"
            })

            // Set the drag target to null
            this.drag_target = null

            // Set the drop target to null
            this.drop_target = null

            // Set the dragging ghost item to null
            this.dragging_ghost_item = null

            // Remove the ghost items
            remove_ghost_items(this.ghost_items())
        })

        // Touch events

        // Add touch start event on the parent element
        this.parent.addEventListener('touchstart', (event) => {
            // If the event target is not in the parent, then return null
            if (!Array.from(this.parent.children).includes(event.target)) return

            // Set the drag target
            this.drag_target = event.target

            // Set the position of the drag item viewer
            this.set_drag_item_viewer_styles({
                top: `${get_elem_centery(this.drag_target)}px`
            })

            // Set the opacity of the drag item viewer to 1 and set its innerHTML to the innerHTML of the event target
            setTimeout(() => {
                this.set_drag_item_viewer_styles({
                    opacity: "1"
                })
                this.drag_item_viewer.innerHTML = this.drag_target.innerHTML
            }, 0)

            // Set the opacity of the dragging item to 0
            this.drag_target.style.opacity = "0"

            // Create the ghost items
            for (let item of Array.from(this.parent.children)) {
                let ghost_item = create_ghost_item(item, this.item_styles)

                // Set the styles of the ghost items
                this.set_ghost_item_styles(this.df_ghost_item_styles, ghost_item)

                // Add the ghost item to the body
                document.body.appendChild(ghost_item)
            }

            // Set all ghost items to opacity 1
            this.set_ghost_item_styles({
                opacity: "1"
            })

            // Set the dragging ghost item
            this.dragging_ghost_item = this.ghost_items()[get_item_index(this.parent, this.drag_target)]
        })

        // Add touch move event on the parent element
        this.parent.addEventListener('touchmove', (event) => {
            // If the drag target is not set, then return null
            if (!this.drag_target) return

            // If the touch point is not in the items of the parent, then return null
            if (!Array.from(this.parent.children).includes((document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY)))) return

            // If the touch point already in the drop target, then return null
            if (this.drop_target == document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY)) return

            // Set the drop target
            this.drop_target = document.elementFromPoint(event.touches[0].clientX, event.touches[0].clientY)

            // Set the position of the drag item viewer
            this.set_drag_item_viewer_styles({
                top: `${get_elem_centery(this.drop_target)}px`
            })

            // Set the tops of the dragging ghost item and the drop point item
            let dragging_ghost_item_top = this.dragging_ghost_item.getBoundingClientRect().top
            let drop_target_top = Array.from(this.parent.children)[get_item_index(this.parent, this.drop_target)].getBoundingClientRect().top

            // Move the ghost items
            if (dragging_ghost_item_top > drop_target_top) {
                // The above ghost item
                let below_point_y = get_elem_centery(this.dragging_ghost_item)
                this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item) - 1].style.top = `${below_point_y}px`

                // The below ghost item
                let above_point_y = get_elem_centery(Array.from(this.parent.children)[get_item_index(this.parent, this.drop_target)])
                this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item)].style.top = `${above_point_y}px`

                document.body.insertBefore(this.dragging_ghost_item, this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item) - 1])
            } else if (dragging_ghost_item_top < drop_target_top) {
                // The below ghost item
                let above_point_y = get_elem_centery(this.dragging_ghost_item)
                this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item) + 1].style.top = `${above_point_y}px`

                // The above ghost item
                let below_point_y = get_elem_centery(Array.from(this.parent.children)[get_item_index(this.parent, this.drop_target)])
                this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item)].style.top = `${below_point_y}px`

                document.body.insertBefore(this.dragging_ghost_item, this.ghost_items()[Array.from(this.ghost_items()).indexOf(this.dragging_ghost_item) + 2])
            }
        })

        document.body.addEventListener('touchend', (event) => {
            // If the drag target is not set, then return null
            if (!this.drag_target) return

            // If the drop target is not set, then return null
            if (!this.drop_target) return

            // If the drag target idx is greater than the drop target idx, then insert the drag target before the drop target
            if (get_item_index(this.parent, this.drag_target) > get_item_index(this.parent, this.drop_target)) {
                this.parent.insertBefore(this.drag_target, this.drop_target)
            } else if (get_item_index(this.parent, this.drag_target) < get_item_index(this.parent, this.drop_target)) {
                // If the drag target idx is less than the drop target idx, then insert the drag target after the drop target
                this.parent.insertBefore(this.drag_target, this.drop_target.nextSibling)
            }

            // Set the opacity of the dragging item to 1
            this.drag_target.style.opacity = "1"

            // Set the opacity of the drag item viewer to 0
            this.set_drag_item_viewer_styles({
                opacity: "0"
            })

            // Set the drag target to null
            this.drag_target = null

            // Set the drop target to null
            this.drop_target = null

            // Set the dragging ghost item to null
            this.dragging_ghost_item = null

            // Remove the ghost items
            remove_ghost_items(this.ghost_items())
        })
    }
}

export default DraggableList