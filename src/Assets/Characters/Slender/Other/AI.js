#pragma strict

var target : Transform;
var rotSpeed = 3;

var myTransform : Transform;

function Awake()
{
	myTransform = transform;
}

function Start () 
{
	target = GameObject.FindWithTag("Player").transform;
}

function Update () 
{
	myTransform.rotation = Quaternion.Slerp(myTransform.rotation,Quaternion.LookRotation(target.position - myTransform.position),rotSpeed * Time.deltaTime);
}