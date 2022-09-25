class Controller{
constructor(up, right, down, left, btn)
    {
        this.up = up;
        this.right = right;
        this.down = down;
        this.left = left;
        this.btn = btn;

        this.register();
    }

    state = {"Horizontal": 0, "Vertical": 0, "Button": false};


/**Registers the controller to the event queue */
    register()
    {
        document.addEventListener('keydown', (event) => {
            var code = event.code;
            
            if(event.repeat)
            {
                return;
            }
          
            if(code == this.up)
            {
                this.state.Vertical += -1;
            }
            if(code == this.down)
            {
                this.state.Vertical += 1;
            }
            if(code == this.right)
            {
                this.state.Horizontal += 1;
            }
            if(code == this.left)
            {
                this.state.Horizontal += -1;
            }  
            if(code == this.btn)
            {
                this.state.Button = true;
                player1.groundFrames = 1;
            }
            if(code == "KeyR" && document.activeElement.tagName != "INPUT")
            {
                location.href = "index.html";
            }
          
          
          }, false);


          document.addEventListener('keyup', (event) => {
            var code = event.code;
          
            if(code == this.up)
            {
                this.state.Vertical -= -1;
            }
            if(code == this.down)
            {
                this.state.Vertical -= 1;
            }
            if(code == this.right)
            {
                this.state.Horizontal -= 1;
            }
            if(code == this.left)
            {
                this.state.Horizontal -= -1;
            }  
            if(code == this.btn)
            {
                this.state.Button = false;
                if(player1.jumpSpeed > 0)
                {
                    player1.jumpSpeed = Math.floor(Math.sqrt(player1.jumpSpeed));
                }
                gravity = 0.8;
            }
          
          
          }, false);
    }
  }