$(document).ready( function() {

	var maxTime = 5000, // 5 seconds
	startTime = Date.now();
	var isAdd = false;
	var isAddSelect = false;
	
	var interval = setInterval(function () {
		//combobox tipo de consulta chat
			if ($('.cx-docked-WebChat').is(':visible') && $('.cx-docked-SendMessage').is(':visible')) {
				$('.cx-docked-WebRTC .cx-widget').css( 'right', '745px');
				
			}
			if ($('#cx_webchat_form_tipoconsulta').is(':visible')){				
				$("#cx_webchat_form_tipoconsulta").before('<select id="cx_webchat_form_tipoconsulta_select" class="cx-form-control"></select>');
			$("#cx_webchat_form_tipoconsulta_select").append("<option value='Agendamiento'>Agendamiento</option><option value='Confirmacion'>Confirmacion</option><option value='Cancelacion'>Cancelacion</option><option value='Reposos'>Reposos</option><option value=' Reclamos'> Reclamos</option>");
				
				$("#cx_webchat_form_tipoconsulta").remove();				
			}
			
			/* if ($('.cx-channels').is(':visible')) {
					if(!isAdd){
						isAdd = true;
						
						var append_content = '';
						append_content += '<div class="cx-channel Channel03 " onclick="getFormRTC()" style="display: block;">';
						append_content += '	<div class="cx-icon">';
						append_content += '		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 100 100">';
						append_content += '			<g class="cx-svg-icon-tone1"><path d="M82.0072679,63.9945399 L99.0854947,75.5711715 C99.712061,75.9946115 100.058938,76.7243033 99.9917501,77.4774328 C99.9511249,77.9711858 98.7745554,89.6743806 85.1104114,96.7728604 C81.5041399,98.6478716 77.0400508,100.001005 71.6743938,100.001005 C60.4212017,100.002567 45.1961109,94.0462816 25.5756814,74.4258521 C-3.40261641,45.4459918 -2.57292396,26.0552512 3.22867313,14.8911221 C10.327153,1.22697813 22.0303477,0.051971125 22.5241007,0.00822086409 C23.2819177,-0.0589670366 24.006922,0.289472541 24.4303621,0.914476268 L35.9726184,17.9427028 C38.1335688,21.3427231 37.6585659,25.6396237 34.8538617,28.4443279 L27.2085036,36.089686 C30.9991512,41.5600311 36.4679338,48.5100726 43.9789161,56.0226174 C52.178965,64.2226663 59.6915098,69.968013 65.3571686,73.7727232 L62.9587168,77.2102437 C57.4758716,73.5211592 50.3664542,68.0898768 42.5164074,60.4320187 L42.5070324,60.4413937 L41.0335861,58.9679474 L39.5601398,57.4945012 L39.5710773,57.4851261 C22.825665,40.3209613 16.6209405,26.5990044 16.3584389,26.0083759 L15.5131214,24.1052396 L19.3178316,22.4146045 L20.1662741,24.3146158 C20.1959618,24.3802412 21.6303454,27.5161974 24.8538021,32.5506024 L31.9085317,25.4974354 C33.3226026,24.0833644 33.5616665,21.9177265 32.4897851,20.2286539 L21.733471,4.36293433 C18.9459544,4.9941881 11.7724741,7.48170293 6.92557018,16.8130086 C1.76772692,26.7411928 1.32709929,44.2850474 28.522574,71.4805221 C55.7164861,98.6728717 73.2603407,98.2338066 83.1885249,93.0759633 C92.5135805,88.2306219 95.0042204,81.0633917 95.6385992,78.2665 L79.7213168,67.4773732 C78.1853701,66.5039299 76.1931707,66.6679934 74.7853498,67.8555004 L71.2462662,65.4570486 L71.5572056,65.1461093 C74.3603473,62.3429676 78.6588104,61.8695273 82.0072679,63.9945399 Z M63.6692368,33.6803289 L88.4051777,8.94438804 L91.3522629,11.8914733 L66.6163221,36.6274141 L80.3376133,36.6274141 L80.3376133,40.7933363 L62.626975,40.7933363 C60.9018519,40.7933363 59.501752,39.394799 59.501752,37.6681133 L59.501752,19.9590376 L63.6692368,19.9590376 L63.6692368,33.6803289 Z"></path></g>';
						append_content += '		</svg>';
						append_content += '	</div>';
						append_content += '	<div class="cx-channel-details">';
						append_content += '		<div class="cx-name i18n">Llamanos</div>';
						append_content += '		<div class="cx-availability">';
						append_content += '			<div class="cx-message i18n"></div>';
						append_content += '			<div class="cx-status">';
						append_content += '				<span class="cx-status-icon"></span>';
						append_content += '				<span class="cx-status-time i18n"></span>';
						append_content += '				<span class="cx-status-message"></span>';
						append_content += '				<span class="cx-subtitle i18n"></span>';
						append_content += '			</div>';
						append_content += '		</div>';
						append_content += '	</div>';
						append_content += '</div>';
						
						
						$( ".cx-channel-selector .cx-wrapper" ).width("422px");
						$( ".cx-channels" ).append( append_content );	
						
						//Step 1: Check WebRTC Support
						if(!check()){
							$(".Channel03").addClass("cx-channel-disable");
							$(".Channel03 .cx-status-time").html("Indisponible");
						}
					}
					//clearInterval(interval);
			}else{
				isAdd = false;
			} */
		},
		200 // 0.1 second (wait time between checks)
	);
});

function getFormRTC(){
	//STEP2: Create Grtc.Client
	testGrtcClientConstructor(true, false);	
	
	//STEP3: Enable Media Sources
	setMediaSources();
	
	var title = "Llamanos";
	var class_div ='cx-first';
	$( ".ow-modal .cx-button-close" ).click();
	if ($('.cx-window-manager .cx-first').is(':visible')) {
		class_div = 'cx-last';
	}
	
	if (!$('.cx-docked-WebRTC').is(':visible')) {
		var append_content = '';
		append_content += '<div class="cx-dock cx-desktop '+class_div+' cx-dock-view cx-docked-WebRTC" tabindex="0">';
		append_content += ' <div class="cx-widget cx-common-container cx-send-message cx-close cx-minimize cx-theme-light cx-desktop" data-gcb-service-node="true" style="height: 0px; transition: right 1s cubic-bezier(0, 1, 0.5, 1) 0s, transform 0.5s ease-in-out 0s; right: 399px; bottom: 0px;">';
		//append_content += ' <div class="cx-widget cx-common-container cx-send-message cx-close cx-minimize cx-theme-light cx-desktop" data-gcb-service-node="true" style="height: 0px;" >';
		append_content += '	<div class="cx-button-group cx-buttons-window-control">';
		append_content += '		<button class="cx-icon cx-button-minimize" tabindex="0" data-icon="minimize"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 100 100"><rect class="cx-svg-icon-tone1" width="100" height="18" y="82" x="0"></rect></svg></button>';
		append_content += '		<button class="cx-icon cx-button-close" tabindex="0" data-icon="close"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 100 100"><path class="cx-svg-icon-tone1" d="M100,14.29,64.28,50,100,85.7,85.7,100,50,64.28,14.3,100,0,85.7,35.72,50,0,14.29,14.3,0,50,35.71,85.7,0Z" transform="translate(-0.02 -0.01)"></path></svg></button>';
		append_content += '	</div>';
		append_content += '	<div class="cx-titlebar">';
		append_content += '		<div class="cx-icon"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 100 100"><g class="cx-svg-icon-tone1"><path d="M82.0072679,63.9945399 C78.6588104,61.8695273 74.3603473,62.3429676 71.5572056,65.1461093 L71.2462662,65.4570486 L74.7853498,67.8555004 C76.1931707,66.6679934 78.1853701,66.5039299 79.7213168,67.4773732 L95.6385992,78.2665 C95.0042204,81.0633917 92.5135805,88.2306219 83.1885249,93.0759633 C73.2603407,98.2338066 55.7164861,98.6728717 28.522574,71.4805221 C1.32709929,44.2850474 1.76772692,26.7411928 6.92557018,16.8130086 C11.7724741,7.48170293 18.9459544,4.9941881 21.733471,4.36293433 L32.4897851,20.2286539 C33.5616665,21.9177265 33.3226026,24.0833644 31.9085317,25.4974354 L24.8538021,32.5506024 C21.6303454,27.5161974 20.1959618,24.3802412 20.1662741,24.3146158 L19.3178316,22.4146045 L15.5131214,24.1052396 L16.3584389,26.0083759 C16.6209405,26.5990044 22.825665,40.3209613 39.5710773,57.4851261 L39.5601398,57.4945012 L41.0335861,58.9679474 L42.5070324,60.4413937 L42.5164074,60.4320187 C50.3664542,68.0898768 57.4758716,73.5211592 62.9587168,77.2102437 L65.3571686,73.7727232 C59.6915098,69.968013 52.178965,64.2226663 43.9789161,56.0226174 C36.4679338,48.5100726 30.9991512,41.5600311 27.2085036,36.089686 L34.8538617,28.4443279 C37.6585659,25.6396237 38.1335688,21.3427231 35.9726184,17.9427028 L24.4303621,0.914476268 C24.006922,0.289472541 23.2819177,-0.0589670366 22.5241007,0.00822086409 C22.0303477,0.051971125 10.327153,1.22697813 3.22867313,14.8911221 C-2.57292396,26.0552512 -3.40261641,45.4459918 25.5756814,74.4258521 C45.1961109,94.0462816 60.4212017,100.002567 71.6743938,100.001005 C77.0400508,100.001005 81.5041399,98.6478716 85.1104114,96.7728604 C98.7745554,89.6743806 99.9511249,77.9711858 99.9917501,77.4774328 C100.058938,76.7243033 99.712061,75.9946115 99.0854947,75.5711715 L82.0072679,63.9945399 Z"></path></g></svg></div>';
		append_content += '		<div class="cx-title">'+title+'</div>';
		append_content += '		<div class="cx-subtitle"></div>';
		append_content += '	</div>';
		append_content += '	<div class="cx-body"><div role="alertdialog" class="cx-alert cx-confirmation cx-send-failed cx-theme-background">';
		append_content += '	<div class="cx-error-container"></div>';	
		append_content += '</div>';		
		append_content += '<form class="cx-form-horizontal cx-send-message-form" data-async="" novalidate="">';
		append_content += '	<div class="cx-wrapper cx-first" tabindex="0">';
		append_content += '		<div class="cx-form">';
		append_content += '			<div class="cx-form-inputs">';
		append_content += '				<table>';
		append_content += '					<tbody><tr>';
		append_content += '						<th><label class="cx-control-label i18n" for="cx_webrtc_form_cedula" data-message="EmailFormCedula">Cedula</label></th>';
		append_content += '						<td><input class="cx-form-control i18n" id="cx_webrtc_form_cedula" maxlength="100" name="cedula" type="text" data-message="EmailFormPlaceholderCedula" data-message-type="placeholder" autofocus="" placeholder="Requerido"></td>';
		append_content += '					</tr>';
		append_content += '					<tr>';
		append_content += '						<th><label class="cx-control-label i18n" for="cx_webrtc_remoteDNInput" data-message="EmailFormFirstName">Numero</label></th>';
		append_content += '						<td><input disabled class="cx-form-control i18n" id="cx_webrtc_remoteDNInput" value="25020" maxlength="100" name="firstname" type="text" data-message="EmailFormPlaceholderFirstName" data-message-type="placeholder" autofocus="" placeholder="Requerido"></td>';
		append_content += '					</tr>';		
		append_content += '				</tbody>';
		append_content += '			</table>';
		append_content += '			<table>';
		append_content += '				<tbody>';
		append_content += '					<tr>';
		append_content += '						<td><video width="270px" height="40" id="remoteView" autoplay="autoplay" controls></video></td>';
		append_content += '					</tr>';
		append_content += '				</tbody>';
		append_content += '			</table>';
		
		append_content += '			</div>';
		append_content += '			<div class="cx-form-group cx-file-details">';
		append_content += '				<div class="cx-file-list" cellspacing="0" cellpadding="0"></div>';
		append_content += '			</div>';

		append_content += '			<div class="cx-form-group cx-submitForm">';
		append_content += '					<button onclick="cortarLlamada()" type="button" data-message="EmailFormSend" class="cx-btn cx-btn-default i18n">Cortar</button>';
		append_content += '					<button onclick="register();" class="cx-btn cx-btn-primary " type="button">Llamar</button>';
		append_content += '			</div>';
		append_content += '		</div>';
		append_content += '	</div>';
		append_content += '</form>';
		append_content += '</div>';
		append_content += '	<div class="cx-button-container"></div>';
		append_content += '	<div class="cx-footer">';
		append_content += '		<div class="cx-powered-by">Powered by <span class="cx-icon" data-icon="logo"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 318 65"><g class="cx-svg-icon-tone1"><path d="M309.6,17H308v-0.6h3.8V17h-1.6v4.2h-0.7V17z"></path><path d="M314.6,21.2l-1.3-4.2v4.2h-0.7v-4.8h1.1l1.2,4l1.2-4h1.1v4.8h-0.7V17l-1.3,4.2L314.6,21.2L314.6,21.2z"></path><path d="M32.4,4.2c1.6,0,2.8,1.3,2.8,2.8c0,1.6-1.3,2.8-2.8,2.8c0,0,0,0,0,0c0,0-0.1,0-0.1,0c-1.5-0.1-2.6-1.2-2.7-2.7c-0.1-1.6,1.1-2.9,2.7-3C32.3,4.2,32.4,4.2,32.4,4.2 M32.4,0.5c-3.6,0-6.6,2.9-6.6,6.6c0,3.5,2.8,6.4,6.2,6.6c0.1,0,0.2,0,0.3,0c3.6,0,6.5-3,6.5-6.6C38.9,3.4,36,0.5,32.4,0.5L32.4,0.5z"></path><path d="M28,46.2c3.6,0,6.6,3,6.6,6.6c0,3.6-3,6.6-6.6,6.6h-7.2c-3.6,0-6.6-3-6.6-6.6c0-3.6,3-6.6,6.6-6.6L28,46.2 M28,41.9h-7.2c-6,0-10.9,4.8-11,10.9c0,6,4.8,10.9,10.9,11c0,0,0.1,0,0.1,0H28c6,0,10.9-4.8,11-10.9C39,46.9,34.1,41.9,28,41.9C28.1,41.9,28.1,41.9,28,41.9L28,41.9z"></path><path d="M28,20.7c3.6,0,6.6,3,6.6,6.6c0,3.6-3,6.6-6.6,6.6H11.2c-3.6,0-6.6-3-6.6-6.6c0-3.6,3-6.6,6.6-6.6l0,0H28 M28,16.4H11.2c-6,0-10.9,4.9-10.9,10.9s4.9,10.9,10.9,10.9H28c6,0,10.9-4.9,10.9-10.9S34.1,16.4,28,16.4C28,16.4,28,16.4,28,16.4z"></path><polygon points="97.4,63.8 97.4,16.4 124.1,16.4 124.1,21 102.2,21 102.2,37.5 121.9,37.5 121.9,42.1 102.2,42.1 102.2,59.1 124.1,59.1 124.1,63.8 "></polygon><polygon points="176,63.8 176,16.4 202.7,16.4 202.7,21 180.8,21 180.8,37.5 200.5,37.5 200.5,42.1 180.8,42.1 180.8,59.1 202.7,59.1 202.7,63.8 "></polygon><polygon points="255.9,63.8 255.9,44.1 239.9,16.4 245.2,16.4 258.3,39.1 271.3,16.4 276.6,16.4 260.6,44.1 260.6,63.8 "></polygon><polygon points="166.3,63.8 166.3,16.4 161.6,16.4 161.6,55.1 138.1,16.4 133.3,16.4 133.3,16.4 133.3,63.8 138.1,63.8 138.1,25 161.6,63.8 "></polygon><path d="M72.4,43.4h11.4v3.8c0,9.3-5.9,12.6-11.4,12.6S61,56.4,61,47.2V33c0-9.3,5.9-12.6,11.4-12.6c5.7-0.2,10.6,4,11.2,9.7h4.8c-1.1-8.8-7.3-14.4-15.9-14.4c-9.6,0-16.1,6.9-16.1,17.2v14.3c0,10.3,6.5,17.2,16.1,17.2s16.1-6.9,16.1-17.2v-8.4H72.4L72.4,43.4L72.4,43.4z"></path><path d="M213.3,49.4c0.4,6.4,4.6,10.3,10.6,10.3c6,0,9.3-3,9.3-8.3c0.1-3.9-2.7-7.2-6.5-7.9l-8-2.2c-5.9-1.6-9.4-6.4-9.4-12.8c0-7.7,5.5-12.9,13.6-12.9c9.3,0,13.5,6.5,14.3,13h-4.7c-1.1-5.4-4.5-8.3-9.6-8.3c-5.4,0-8.9,3.2-8.9,8.2c-0.2,3.8,2.4,7.3,6.1,8.1l8.3,2.2c5.7,1.4,9.7,6.6,9.5,12.5c0,8-5.4,13-14,13c-10.8,0-15.2-8.2-15.3-15L213.3,49.4L213.3,49.4z"></path><path d="M283.4,49.4c0.4,6.4,4.6,10.3,10.6,10.3c6,0,9.3-3,9.3-8.3c0.1-3.9-2.7-7.2-6.5-7.9l-8-2.2c-5.9-1.6-9.4-6.4-9.4-12.8c0-7.7,5.5-12.9,13.6-12.9c9.3,0,13.5,6.5,14.3,13h-4.7c-1.1-5.4-4.5-8.3-9.6-8.3c-5.4,0-8.9,3.2-8.9,8.2c-0.2,3.8,2.4,7.3,6.1,8.1l8.3,2.2c5.7,1.4,9.7,6.6,9.5,12.5c0,8-5.4,13-14,13c-10.8,0-15.2-8.2-15.3-15H283.4L283.4,49.4z"></path></g></svg></span></div>';
		append_content += '	</div>';
		append_content += '	<div class="cx-smokescreen"></div>';
		append_content += '	<div class="cx-dialog-container"></div>';
		append_content += '	<div class="cx-loading-screen">';
		append_content += '		<div class="cx-loading-icon cx-icon" data-icon="loading"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" viewBox="0 0 100 100"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g stroke="#E5EAF0"><circle cx="50" cy="50" r="48"></circle></g></g><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-dasharray="58,1000"><g stroke="#75A8FF" stroke-width="5"><circle cx="50" cy="50" r="48"></circle></g></g></svg></div>';
		append_content += '	</div>';
		append_content += '</div></div>';
		
		$( '.cx-window-manager' ).append( append_content );	
		$( '.cx-docked-WebRTC .cx-widget' ).animate({"height":"300px"},  500);
				
		$( '.cx-docked-WebRTC .cx-button-close').click(function() {
			$( '.cx-docked-WebRTC .cx-widget' ).animate({"height":"0px"},  500, function() {
				$( ".cx-docked-WebRTC" ).remove();
			});
		});
	}		
}

function register(e){
	/*	
	setTimeout(function(){
		//STEP4: Sign in with Gateway
		testRegister();
	}, 2000);
	*/
	
	//STEP4: Sign in with Gateway
	testRegister();
}
function cortarLlamada(){
	//STEP6: Disconnect Call
	testHangUp();
	//STEP7: Sign out from Gateway
	testDisconnect();
	//STEP8: Disable Media Sources
	//testDisableMediaSource();
}

var grtcClient = null;
var grtcSession = null;
var localID = "";
var remoteID = "";
var remoteStatusMsg = "";
var conf = null;
var remoteViewFactor = 1;

// This may be set to true if a new media session is to be created on each O/A cycle.
// This is currently set to true for Firefox, which doesn't yet support renegotiation.
// However, this approach could be used with other browsers as well, if needed, to
// avoid some renegotiation issue.  Note, some RSMP configuration may be needed for this.
var newSessionOnNewOffer = false;

// This should be set to true if auto answering is to be used using "talk" event.
// You could alternatively comment out the code that adds the onIncomingCall handler,
// though it may be good to have this handler to inform the app of an incoming call.
// NOTE: This could be set using an option when creating the Grtc client.
var useTalkEvent = false;

// Media constraints used when making an offer, saved from grtc client constructor,
// and possibly overwritten by a call to testCall().  These are  also used on an 
// INVITE message, requiring a new offer to be sent back.
// For accept call or answer, we always use 'true' for both audio and video.
// NOTE: These could be set using an option when creating the Grtc client.
var callAudioConstraints = true;
var callVideoConstraints = true;

// Object to store the last peer call statistics for future calculations.
var savedStats = null;

// The configuration object is used to construct Grtc.Client.
// These parameters are retrieved from user input in STEP2 of the
// web apps, so this function should be called right before constructing
// Grtc.Client. The default values of these parameters are set in the
// web apps (HTML files).

// The configuration object is used to construct Grtc.Client.
// These parameters are retrieved from user input in STEP2 of the
// web apps, so this function should be called right before constructing
// Grtc.Client. The default values of these parameters are set in the
// web apps (HTML files).
function getConfig() {
    conf = {
        'webrtc_gateway': 'http://',
        'stun_server': '',
        'turn_server': '',
        'turn_username': '',
        'turn_password': '',
        'sip_username': '',
        'sip_password': '',
        'dtls_srtp': false,
        'enable_ipv6': false,
        'noanswer_timeout': '60000',
        'ice_timeout': '3000',
        'ice_optimization': false,
        'polling_timeout': '30000',
        'use_rsa_certificate': false
    };
}
// Checks if WebRTC is supported by the browser in use.
function check() {
    var rc = Grtc.isWebrtcSupported();
    if (true) {
        return true;
    } else {
        return false;
    }
}

function testGrtcClientConstructor(audioConstraints, videoConstraints) {
    if (typeof audioConstraints !== "undefined") {
        callAudioConstraints = audioConstraints;
	}
    if (typeof videoConstraints !== "undefined") {
        callVideoConstraints = videoConstraints;
    }
    
    //var mediaSelect = document.getElementById("mediaTypes").value;
	var mediaSelect = 'AO';
    if (mediaSelect === 'AV')      { callAudioConstraints = true;   callVideoConstraints = true;  }
    else if (mediaSelect === 'AO') { callAudioConstraints = true;   callVideoConstraints = false; }
    else if (mediaSelect === 'VO') { callAudioConstraints = false;  callVideoConstraints = true;  }
    console.log("Media types to be used by default: audio=" + callAudioConstraints + "; video=" + callVideoConstraints);
    
    //var autoAnswer = document.getElementById("autoAnswer").value;
	var autoAnswer = 'false'
    if (autoAnswer === 'false')    { useTalkEvent = false;  }
    else                           { useTalkEvent = true;   }
    console.log("Call Answer Method: " + (useTalkEvent ? "Auto (Talk Event)" : "Manual"));
        
    $('#config-section').hide();
    $('#main').show();

    // Construct a Grtc.Client instance that initially holds
    // a null gMediaSession reference.
    getConfig();
    console.log("Creating Grtc.Client with configuration: " + JSON.stringify(conf));
    grtcClient = new Grtc.Client(conf);
    
    // Default log level in JSAPI is 3; use 4, for more, or a smaller value for less logging.
    grtcClient.setLogLevel(4);
    
    newSessionOnNewOffer = Grtc.getWebrtcDetectedBrowser() === "firefox";
    // The following isn't needed for Firefox, as it is on in JSAPI by default for Firefox.
    //grtcClient.setRenewSessionOnNeed(newSessionOnNewOffer);
    // The gateway configuration rsmp.new-pc-support should be set to 0 with this setting.
    // See https://docs.genesys.com/Special:Repository/webrtc_gateway85rn.html?id=2d43c995-1f2b-4fdb-8a66-60eefebb5534
    grtcClient.setRenewSessionOnNeed(false);
    
    // Set the media constraints to be used for creating offer or answer SDPs.
    // These may be necessary when JSAPI auto-responds with offer or answer SDPs
    // on session renegotiation or hold/talk events.
    grtcClient.setMediaConstraintsForOffer(callAudioConstraints, callVideoConstraints);
    grtcClient.setMediaConstraintsForAnswer(callAudioConstraints, callVideoConstraints);
    
    // Set max video bit rate (Kbps) (uses b=AS in SDP); the default in JSAPI is 500 Kbps.
    grtcClient.setVideoBandwidth(500);
    
    // Redefine grtcClient.filterIceCandidates() to discard candidates that may delay ICE.
    grtcClient.filterIceCandidates = function (Candidates) {
        outCandidates = [];
        var count = Candidates.length;
        for (var i = 0; i < count; i++) {
            var strCandidate = JSON.stringify(Candidates[i]);
            // Ignore private addresses, which aren't necessary and seem to add delay.
            // Also ignore tcp candidates that aren't used.
            if (strCandidate.match(/ 192\.168\.\d{1,3}\.\d{1,3} \d+ typ host/i) === null &&
                strCandidate.match(/ tcp \d+/i) === null) { 
                outCandidates.push(Candidates[i]);
            }
        }
        return outCandidates;
    };
    
    // Create a MediaSession instance to make or accept calls.
    // It's possible to reuse the same session instance for multiple calls, though a
    // new instance can be created for every call (as it used to be).
    grtcSession = new Grtc.MediaSession(grtcClient);
    grtcSession.onRemoteStream.add(updateRemoteStatus);
    grtcSession.onRemoteStream.add(attachRemoteStream);
    grtcSession.onSessionHold.add( function(isTrue) {
      if (isTrue) {
        console.log("Call on-hold");
        $("#remoteStatus").text(remoteStatusMsg + " - on-hold");
      }
    });

    // Register a handler to deal with an incoming call, with or without SDP offer.
    // This will simply accept or reject the call.  NOTE: This handler may not need
    // to be defined, if the call is going to be auto-answered on NOTIFY talk events.
    // NOTE: This handler is not invoked any more on session renegotiation.
    grtcClient.onIncomingCall.add(function (data) {
        var doAccept = true;
        try {
            // Ask user to confirm whether to accept or reject call, unless "talk"
            // event is to be used.
            var user_said = useTalkEvent ? true : window.confirm(
                "Do you want to accept a call from " + data.peer + "?");
            if (user_said === true) {
                remoteID = data.peer;
                $("#remoteStatus").empty();
                remoteStatusMsg = "Call from " + remoteID;
                $("#remoteStatus").append(remoteStatusMsg);
            } else {
                doAccept = false;
            }
            // We could create a new MediaSession for every call, or reuse one created earlier.
            /*if (grtcSession === null) {
                try {
                    // Create a MediaSession instance and accept/reject call.
                    grtcSession = new Grtc.MediaSession(grtcClient);
                    grtcSession.onRemoteStream.add(updateRemoteStatus);
                    grtcSession.onRemoteStream.add(attachRemoteStream);
                } catch (e) {
                    alert("Could not create Grtc.MediaSession for incoming call.");
                    return false;
                } 
            } */
        } catch (e) {
            alert("Could not accept call from " + data.peer);
            return false;
        }
        if (useTalkEvent) { return false; }
        if (doAccept) {
            //grtcSession.acceptCall(true, true, remoteID);
            grtcSession.acceptCall(callAudioConstraints, callVideoConstraints, remoteID);
        } else {
            grtcSession.rejectCall();
            //grtcSession = null;   // Don't set to null to reuse the session for future calls
        }
        return false;
    });
    
    // NOTE: This event is experimental, and not officially supported!
    grtcClient.onCallEvent.add(function (data) {
        console.log("Call event: " + data.event);
		testSendData();
        return false;
    });
    
    // Invoked on a NOTIFY Event, talk or hold.  It could be used for informing the user
    // of call status, and/or getting the remoteID when onIncomingCall is not used.
    grtcClient.onNotifyEvent.add(function (data) {
        console.log("Notify event received: " + data.event);
        if (remoteID === "") {
            remoteID = data.peer;
            remoteStatusMsg = "Call from " + remoteID;
        }
        $("#remoteStatus").empty();
        if (data.event === "talk") {
            $("#remoteStatus").append(remoteStatusMsg + " - established");
			
			
        }
        else if (data.event === "hold") {
            $("#remoteStatus").append(remoteStatusMsg + " - on-hold");
        }
        return false;
    });
    
    // Invoked when info data arrives from the peer.
    grtcClient.onInfoFromPeer.add(function (data) {
        alert("Got data from peer:\n" + JSON.stringify(data));
        return false;
    });
    
    // Invoked when call statistics arrives from the WebRTC Server.
    grtcClient.onStatsFromServer.add(function (stats) {
        //console.log("Got call statistics from peer:\n" + JSON.stringify(stats));
        if (typeof stats.audio === 'object') {
            console.log("Round-Trip Times (RTT) for audio RTCP: latest " + stats.audio.rtt +
                ", max " + stats.audio.rtt_max + ", average " + stats.audio.rtt_average);
            var aRxStats = stats.audio.rx;
            var lostRatio = (aRxStats.lost * 100)/(aRxStats.lost + aRxStats.packets);
            if (aRxStats.jitter > 100 || lostRatio > 1) {
                console.log("Audio quality may be low - jitter " + aRxStats.jitter +
                    ", lost " + aRxStats.lost + " (" + lostRatio.toFixed(2) + "%)");
            }
            if (savedStats) {
                var audioBR = ((aRxStats.bytes - savedStats.audio.rx.bytes) * 8)/
                              (stats.timestamp - savedStats.timestamp);
                console.log("Audio bit-rate " + audioBR.toFixed(3) + " kbits/sec");
            }
        }
        if (typeof stats.video === 'object') {
            // NOTE: rtt values for video may be unavailable (0), or possibly incorrect,
            // due to frequent RTCP feedback messages.
            var vRxStats = stats.video.rx;
            var lostRatio = (vRxStats.lost * 100)/(vRxStats.lost + vRxStats.packets);
            if (vRxStats.jitter > 500 || lostRatio > 2) {
                console.log("Video quality may be low - jitter " + vRxStats.jitter +
                    ", lost " + vRxStats.lost + " (" + lostRatio.toFixed(2) + "%)");
            }
            if (savedStats && savedStats.video) {
                var videoBR;
                if (vRxStats.bytes > 0) {
                    videoBR = (vRxStats.bytes - savedStats.video.rx.bytes);
                }
                else {  // It's likely sendonly for WebRTC GW (and recvonly for browser)
                    videoBR = (stats.video.tx.bytes - savedStats.video.tx.bytes);
                }
                videoBR = (videoBR * 8)/(stats.timestamp - savedStats.timestamp);
                console.log("Video bit-rate " + videoBR.toFixed(3) + " kbits/sec");
            }
        }
        var aDate = new Date();
        var latency = aDate.getTime() - stats.timestamp;
        console.log("Message latency " + latency + 
            " ms (system clock should be in sync with the server for this to be correct)");
        console.log("Call duration " + (stats.duration/1000).toFixed(3) + " Secs");
        if (remoteID.length > 0) {  // Note: this could happen after call is hung up.
            savedStats = stats;
        }
        return false;
    });
    
    // Invoked on ICE failure after being established, say, due to a network problem.
    // The app should try to re-establish ICE by initiating an offer to the gateway.
    // Note, if sending offer fails, JSAPI will retry until it succeeds or session closes.
    grtcClient.onIceDisconnected.add(function (obj) {
        if (grtcSession) // && grtcSession.isEstablished())
        {
            console.log("Trying to restore ICE connection...");
            grtcSession.makeOffer();
        }
        return false;
    });
    
    // Invoked on connection error, such as hanging-get failure.  This could happen
    // when there is a network problem, or when the gateway goes down.
    // The app may retry sign-in in the HA case, or at least, warn the user.
    // Note, JSAPI will retry the hanging-get after 3s. Hence, may want to wait
    // sometime, and then sign out, wait 3s, and then try sign-in again.
    grtcClient.onConnectionError.add(function (obj) {
        if (grtcSession) // && grtcSession.isEstablished())
        {
            //alert("Got connection error: " + JSON.stringify(obj));
            //testDisconnect();
        }
        return false;
    });
    
    // Invoked on WebRTC Gateway error, which may be irrecoverable.
    // The app may want to end the session, or ignore the error.
    grtcClient.onGatewayError.add(function (obj) {
        console.log("Got gateway error: " + JSON.stringify(obj));
        //alert("Got gateway error: " + JSON.stringify(obj));
        //grtcSession.closeSession(true);
        return false;
    });
    
    // Invoked on WebRTC browser API error, which could be recoverable.
    // The app may want to ignore this error, log it, and/or inform the user.
    grtcClient.onWebrtcError.add(function (obj) {
        alert("Got WebRTC error: " + JSON.stringify(obj));
        return false;
    });
    
    // When the peer closes, this event is fired; do the necessary clean-up here.
    grtcClient.onPeerClosing.add(function () {
        if (grtcSession) {
            //grtcSession = null;
        }
        console.log("Call with " + remoteID + " has ended");
        cleanupAfterCall();
        return false;
    });
    
    // Fired on no-answer timeout after making an initial or updated offer to peer.
    grtcClient.onPeerNoanswer.add(function () {
        if (grtcSession) {
            grtcSession.closeSession(true);
            //grtcSession = null;
        }
        cleanupAfterCall();
        return false;
    });
    
    grtcClient.onMediaSuccess.add(function (obj) {
        document.getElementById("localView").style.opacity = 1;
        grtcClient.setViewFromStream(document.getElementById("localView"), obj.stream);
		
        return false;
    });
    
    grtcClient.onMediaFailure.add(function (obj) {
        alert(obj.message);
        return false;
    });
    
    function handleOnConnect(e) {
        $("#localStatus").empty();
        $("#localStatus").append("Registered anonymously");
        return false;
    }

    function handleOnRegister(e) {
        $("#localStatus").empty();
        $("#localStatus").append("Registered as " + localID);
        return false;
    }

    function handleOnConnectFailed(e) {
        alert(e.message);
        localID = "";
        return false;
    }
    
    grtcClient.onConnect.add(handleOnConnect);  
    grtcClient.onRegister.add(handleOnRegister);
    grtcClient.onFailed.add(handleOnConnectFailed);

    window.onbeforeunload = function() {
        grtcClient.disconnect();
    };
    
 
}

// Handlers for onRemoteStream.  These two could be combined into one function.
// However, these demonstrate how multiple handlers could be used with the
// "stopOnFalse" option of the callback.  For e.g., a different handler could be
// added to a different call scenario, i.e., offer, answer, or invite.
function updateRemoteStatus(data) {
    // NOTE: when talk event is used, onNotifyEvent handler is used for this purpose.
    if (useTalkEvent === false) {
        $("#remoteStatus").empty();
        if (remoteID !== "") {      // A BYE could close session before we get here.
            $("#remoteStatus").append(remoteStatusMsg + " - established");
        }
    }
    return true;
}
function attachRemoteStream(data) {
    var element = document.getElementById("remoteView");
    if (element.getAttribute("src") === null) {
        console.log("Attaching remote stream");
    } else {
        console.log("Reattaching remote stream");
    }
    grtcClient.setViewFromStream(element, data.stream);
    return false;
}
// This enables local media sources, based on the selection in the app.
function setMediaSources() {
    //if (!grtcClient) { alert("Grtc.Client instance not created"); return }
    //var mediaSelect = document.getElementById("mediaSources").value;
    var mediaSelect = 'AO';
	if (mediaSelect === 'AO') {
        testEnableMediaSource(true, false);
    } 
}
// This calls JSAPI to obtain a local media stream.
function testEnableMediaSource(audioConstraints, videoConstraints) {
    // calls Grtc.Client.enableMediaSource
    if (!grtcClient) { alert("Grtc.Client instance not created"); }
    else {
        // enable audio and/or video
        grtcClient.enableMediaSource(audioConstraints, videoConstraints);
    }
}

// This calls register method of JSAPI to register with the gateway and SIP Server.
function testRegister() {
    if (!grtcClient) { alert("Grtc.Client instance not created"); }
    else {
		
        var registerID = document.getElementById("cx_webrtc_form_cedula");
		
        if (registerID.value.match(/Anon/) !== null) {
			localID = "Anonymous";
            grtcClient.connect();   // Connect anonymously
        }
        else {                      // Get the selected DN, and register
		
            localID = registerID.value.toLowerCase();
            if (localID.length === 0) {				
                alert("Please select an ID from the drop-down list");
                registerID.focus();
            } else {				
                grtcClient.register(localID);
				
				alert("Llamando..")
				
				//STEP5: Call DN; or Update Call
				setTimeout(testSelectAndCall(), 2000);
				
				
            }
        }
    }
}
function cleanupAfterCall() {
    savedStats = null;
    $("#remoteStatus").empty();
    remoteID = "";
    remoteStatusMsg = "";
}
// This calls JSAPI to release the local media stream that was obtained earlier.
function testDisableMediaSource() {
    // calls Grtc.Client.disableMediaSource
    if (!grtcClient) { alert("Grtc.Client instance not created"); }
    else {
        grtcClient.disableMediaSource();
        document.getElementById("localView").src = "";
    }
}

// This calls connect method of JSAPI to register with the gateway anonymously.
function testConnect() {
    if (!grtcClient) { alert("Grtc.Client instance not created"); }
    else {
        localID = "anonymous";
        grtcClient.connect();
    }
}

// Unregister/sign-out from WebRTC gateway.
function testDisconnect() {
    if (!grtcClient) { alert("Grtc.Client instance not created"); }
    else {
        grtcClient.disconnect();
        $("#localStatus").empty();
        cleanupAfterCall();
        //grtcSession = null;
        localID = "";
    }
}

// Make a new call (with offer), or a new offer to peer to update an existing call.
function testCall(audioConstraints, videoConstraints, holdCall) {
    if (!grtcClient) { alert("Grtc.Client instance not created"); }
    else {
        if (localID.length === 0) {
            alert("Please register first");
            return;
        }
        var remoteDNSelect = document.getElementById("cx_webrtc_remoteDNInput");

        if (remoteDNSelect.value.length > 0) {         
            remoteID = remoteDNSelect.value.toLowerCase();
        }
        // Else, we would use remoteID, given it's already set from existing call.
        if (remoteID.length === 0) {
            alert("Please select an ID from the drop-down list");
            remoteDNSelect.focus();
        } else {
            // We could create a new MediaSession for every call, or reuse one created earlier.
            if (grtcSession === null) {
                $("#remoteStatus").empty();
                remoteStatusMsg = "Call to " + remoteID;
                $("#remoteStatus").append(remoteStatusMsg);
                grtcSession = new Grtc.MediaSession(grtcClient);
                grtcSession.onRemoteStream.add(updateRemoteStatus);
                grtcSession.onRemoteStream.add(attachRemoteStream);
            }  else 
            {
                $("#remoteStatus").empty();
                remoteStatusMsg = "Call to " + remoteID;
                $("#remoteStatus").append(remoteStatusMsg);
            }
            if (typeof audioConstraints !== "undefined") {
                callAudioConstraints = audioConstraints;
            }
            if (typeof videoConstraints !== "undefined") {
                callVideoConstraints = videoConstraints;
            }
			
			grtcSession.makeOffer(remoteID, audioConstraints, videoConstraints, holdCall);
			
		}
    }
}

// Make a call or offer using media constraints based on the app selection.
function testSelectAndCall() {
	
	
    //var receiveSelect = document.getElementById("mediaReceived").value;
	var receiveSelect = 'AO';
	if (receiveSelect === 'AO') {
        testCall(true, false);
    } 
	
	//Send Data
	//testSendData();
	//document.getElementById('XXX').click();
	
}

// Hang up the call.  Note, onPeerClosing handler won't be called in this case.
function testHangUp() {
    if (grtcSession) {
        grtcSession.terminateCall();
        //grtcSession = null;
    }
    cleanupAfterCall();
}

// Update current call - used to mute/unmute the call.
function testUpdateCall(audioConstraints, videoConstraints) {
   if (grtcSession) {
       grtcSession.updateCall(audioConstraints, videoConstraints);
   }
   else {
        alert("Media session or call does not exist");
   }
}

// Put an active call on-hold.
function testHoldCall() {
    if (!grtcClient) { alert("Grtc.Client instance not created"); }
    else if (!grtcSession || remoteID.length === 0 ) {
        alert("Media session or call does not exist");
    }
    else {
        grtcSession.holdCall();
        $("#remoteStatus").text(remoteStatusMsg + " - on-hold");
    }
}

// Resume a call that has been put on-hold.
function testResumeCall() {
    if (!grtcClient) { alert("Grtc.Client instance not created"); }
    else if (!grtcSession || remoteID.length === 0 ) {
        alert("Media session or call does not exist");
    }
    else {
        grtcSession.resumeCall();
    }
}

// Send info data to peer.
// Example data format: name1=val1&name2=val2
function testSendData() {
    if (!grtcClient) { alert("Grtc.Client instance not created"); }
    else if (!grtcSession) { 
        alert("Media session or call does not exist");
    } else {
        //var queryStr = document.getElementById("PeerData").value;
		var queryStr = "V_COLA=teste333";
        var obj = Grtc.deparam(queryStr);
 		if ($.isEmptyObject(obj)) {
            alert("Empty or invalid input data");
        }
        else {
            grtcSession.sendInfo(obj, true);
        }
    }
}