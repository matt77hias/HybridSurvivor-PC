    //- Roam whenever the player is not seen by SM, and the player is not facing SM
    //- Move towards the player whenever player is seen by SM (not necessarily the player seeing him back), and the player is not facing SM
    //- Teleport to a legal position within a maximum and minimum range when:
    //--- A. SM moves outside of the maximum range
    //--- B. SM roams for a random amount of time without seeing the player
    //--- C. The player is facing him (but does not see him), a random amount of time has passed, and there is still a chance he will not teleport at all
     
     
     
     
     
     
     
    #pragma strict
    var moveSpeed:float = 0.0;   // how fast slendy moves
    var maxRange:float = 0.0;   // the maximum range SM can be from the player without teleporting.
     var timer:int = 0;  // a little timer for function timing.
    var wayPoints:GameObject[];  // an array that stores all the waypoints for pathfinding.
    var player: GameObject;   /// the player gameObject, used for targeting
     var targetWaypoint: GameObject; // very important: the current waypoint marked for pathfinding.
    private var lastTarget:GameObject; // ignore this unless you really want to know what it does.
    var isMoving:boolean = false;    //checks if SM is moving. useful for determining whether to stay or roam.
     
    var pointer: GameObject;  // the pointer object used for spotting the player. Make sure it is not too high or too low.
    var range:int = 0;  // the range at which Slenderman can spot a player
    var canSee:boolean = false;  // if Slenderman can see the player (not vice versa or anything)
    var scanInterval:int = 0;   // how often to scan for player distance
     
    function Start () {
     
    wayPoints = GameObject.FindGameObjectsWithTag("waypoint");    // find all the GO's and store them off the start.
    player = GameObject.FindWithTag("Player");
     
    FindRoamPath();   // get us off pathfinding something
    }
     
    function Update () {
     
     
    ////the eye of the Slenderman//////////////////////////////
    ///////////////////you can use your own SM vision code here.
    ///////////////////just make sure canSee is true for proper movement.
    pointer.transform.LookAt(player.transform);
    var hit: RaycastHit;
    if (Physics.Raycast(pointer.transform.position,pointer.transform.forward,hit,range))
        {
            if (hit.collider.gameObject.tag == "Player")
                {
        Debug.DrawRay(pointer.transform.position,pointer.transform.forward,Color.red);
            print(" can see!");
            canSee = true;
                }
            else
                {
                canSee = false;
                }
     
    }
    else if (!Physics.Raycast(pointer.transform.position,pointer.transform.forward,hit,range))
        {
        canSee = false;
        }
    ///////////////////////////////////////////////////////////////////////////////////////////////
     
    /////////////////a private timer. can be replaced with Time function for more accurate results.
    ////////////////////after a certain amount of time, search distance to player.
    ////////////////////the only reason this is set up as a function is because of performance reasons / teleport function
    timer++;
    if (timer > scanInterval)
        {
            searchDistanceToPlayer();
           
            timer = 0;
        }
       
       
        //search for new waypoint once I'm close to one.
    if (Vector3.Distance(transform.position,targetWaypoint.transform.position) < 1)  // this number can be changed on whatevs (depending on scale);
            {
                if (!canSee)  //if I can't see the player. Just to make sure I'm actually roaming.
                    {
                FindRoamPath();
                   }
            }
       
               
    if (isMoving)    //this does the actual movement.  movement is always the same, the target is what's different.
        {
    transform.position = Vector3.MoveTowards(transform.position,targetWaypoint.transform.position,moveSpeed * Time.deltaTime);
        }
       
       
    // If I can see the player, execute the function that finds a path to the the player
    // this is called everyframe because of SM visibility. a quick conditional will allow me to see if I can see the player (no pun intended)
    // if I can see him, then execute FindFollowPath(), which finds the nearest waypoint to the player (as if he is following him).
    if (canSee)
        {
            var nearpoint = FindFollowPath();
            if (lastTarget != nearpoint)            //if it's not the same, then keep on moving
                {
            targetWaypoint = nearpoint.gameObject;
            lastTarget = nearpoint.gameObject; // prevents re-moving to same position - jittery
                }
                else
                {
                isMoving = false;     //you're close enough, stop moving. This works by checking if the same waypoint has been selected twice.
                }
        }
     
    }
     
    function FindRoamPath()   //this doesn't do pathfinding. This just tells us the path to find. In this case, a random one.
        {
            isMoving = true;   // gotta get up off our feet
            var rand:int = Mathf.Floor(Random.Range(0,wayPoints.length));   // a random waypoint has been selected! 
            if (lastTarget != wayPoints[rand])  // similar to above. don't randomly pick the same spot.
                    {
                        targetWaypoint = wayPoints[rand]; // our target waypoint is now a random one from the list.
                        lastTarget = wayPoints[rand];
                    }
                    else
                    {
                    isMoving = false;
                    }
        }
     
    function FindFollowPath() : Transform   //if I see the player, find a path to his position.
        {
        // loop through each tagged object, remembering nearest one found. Original "find nearest" code by Ben Pitt.
        //http://answers.unity3d.com/questions/16676/how-can-i-make-my-gameobject-find-the-nearest-obje.html
        // basically what it does is go through the list of waypoints and finds the nearest one to the -player- through distance.
         var nearestDistanceSqr = Mathf.Infinity;
        var nearestObj : Transform = null;
       
        for (var obj : GameObject in wayPoints) {
     
            var objectPos = obj.transform.position;
            var distanceSqr = (objectPos - player.transform.position).sqrMagnitude;
     
            if (distanceSqr < nearestDistanceSqr) {
                nearestObj = obj.transform;
                nearestDistanceSqr = distanceSqr;
            }
        }
     
        return nearestObj;
    }
       
       
       
       
    function Teleport()    // take me to a random waypoint!   this function does not yet utilize legal (nearby) waypoints
        {
            var rand:int = Mathf.Floor(Random.Range(0,wayPoints.length));
            targetWaypoint = wayPoints[rand];   
            transform.position = wayPoints[rand].transform.position;
        }
       
       
    function searchDistanceToPlayer()   // find distance to player. Might as well check if I'm above range to teleport, too.
    {
    var curDistance:float;
    curDistance = Vector3.Distance(transform.position,player.transform.position);
    if (curDistance > maxRange)
            {
                Teleport();
            }
     
    }