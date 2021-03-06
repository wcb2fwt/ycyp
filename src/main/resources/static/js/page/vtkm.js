const testSeriesDirectory = 'http://wcb:8085/bondent/bonzd/header/';
const data = axios.get('http://wcb:8085/bondent/bonzd/files/'+[[${pkTBLSeriesID}]],{
    params:{}
})
    .then(function (response) {
        const fetchFiles = response.data.map(function (file) {
            const path = testSeriesDirectory + file + '.dcm';
            const axiosget = axios.get(path,{responseType:'blob'}).catch(error => {
                console.log('axios get error');
                console.log(error)
            });
            return axiosget.then(function (response) {
                const jsFile = new window.File([response.data],file)
                console.log(jsFile)
                return jsFile
            })
                .catch(error => {
                    console.log('axios get then error');
                    console.log(error)
                })
        })

        const viewColors = [
            [0,0,0],
            [0,0,0],
            [0,0,0],
            [0.5,0.5,0.5],
        ];
        const ViewTypes = {
            DEFAULT: 0,
            GEOMETRY: 1,
            SLICE: 2,
            VOLUME: 3,
            YZ_PLANE: 4, // Sagittal
            XZ_PLANE: 5, // Coronal
            XY_PLANE: 6, // Axial
        };
        const xyzToViewType = [
            ViewTypes.YZ_PLANE,
            ViewTypes.XZ_PLANE,
            ViewTypes.XY_PLANE,
        ];

        const viewAttributes = [];
        const widget = vtk.Widgets.Widgets3D.vtkResliceCursorWidget.newInstance();
        const widgetState = widget.getWidgetState();
        widgetState.setKeepOrthogonality(true);
        widgetState.setOpacity(0.6);
        widgetState.setSphereRadius(6);
        widgetState.setLineThickness(3);

        const showDebugActors = true;

        const container = document.querySelector('body');

        function createRGBStringFromRGBValues(rgb) {
            if (rgb.length !== 3){
                return 'rgb(0,0,0)';
            }
            return 'rgb(${(rgb[0]*255).toString()},${(rgb[1]*255).toString()},${(rgb[2]*255).toString()})';
        }

        const initialPlanesState = {...widgetState.getPlanes()};

        let view3D = null;
        for (let i=0;i<4;i++){
            const element = document.createElement('div');
            element.setAttribute('class','view');
            element.style.width = '50%';
            element.style.height = '400px';
            element.style.display = 'inline-block';
            container.appendChild(element);

            const grw = vtk.Rendering.Misc.vtkRenderWindowWithControlBar.newInstance();
            grw.setContainer(element);
            grw.resize();

            const obj = {
                renderWindow: grw.getRenderWindow(),
                renderer: grw.getRenderer(),
                GLWindow: grw.getOpenGLRenderWindow(),
                interactor: grw.getInteractor(),
                widgetManager: vtk.Widgets.Core.vtkWidgetManager.newInstance(),
            };

            obj.renderer.getActiveCamera().setParallelProjection(true);
            obj.renderer.setBackground(...viewColors[i]);
            obj.renderWindow.addRenderer(obj.renderer);
            obj.renderWindow.addView(obj.GLWindow);
            obj.renderWindow.setInteractor(obj.interactor);
            obj.interactor.setView(obj.GLWindow);
            obj.interactor.initialize();
            obj.interactor.bindEvents(element);
            obj.widgetManager.setRenderer(obj.renderer);

            if (i<3){
                obj.interactor.setInteractorStyle(
                    // vtk.Interaction.Style.vtkInteractorStyleMPRSlice.newInstance()
                    vtk.Interaction.Style.vtkInteractorStyleImage.newInstance()
                );//????????????
                obj.widgetInstance = obj.widgetManager.addWidget(widget, xyzToViewType[i]);
                obj.widgetInstance.setScaleInPixels(true);
                obj.widgetInstance.setRotationHandlePosition(0.75);
                obj.widgetManager.enablePicking();
                // Use to update all renderers buffer when actors are moved
                obj.widgetManager.setCaptureOn(
                    vtk.Widgets.Core.vtkWidgetManager.Constants.CaptureOn.MOUSE_MOVE
                );
            }else {
                obj.interactor.setInteractorStyle(
                    // vtk.Interaction.Style.vtkInteractorStyleMPRSlice.newInstance()
                    vtk.Interaction.Style.vtkInteractorStyleTrackballCamera.newInstance()
                );
            }

            obj.reslice = vtk.Imaging.Core.vtkImageReslice.newInstance();
            obj.reslice.setSlabMode(vtk.Imaging.Core.vtkImageReslice.SlabMode.MEAN);
            obj.reslice.setSlabNumberOfSlices(1);
            obj.reslice.setTransformInputSampling(false);
            obj.reslice.setAutoCropOutput(true);
            obj.reslice.setOutputDimensionality(2);
            obj.resliceMapper = vtk.Rendering.Core.vtkImageMapper.newInstance();
            obj.resliceMapper.setInputConnection(obj.reslice.getOutputPort());
            obj.resliceActor = vtk.Rendering.Core.vtkImageSlice.newInstance();
            obj.resliceActor.setMapper(obj.resliceMapper);
            obj.resliceActor.getProperty().setColorLevel(1300);
            obj.resliceActor.getProperty().setColorWindow(4400);

            obj.sphereActors = [];
            obj.sphereSources = [];

            for (let j=0;j<3;j++){
                const sphere = vtk.Filters.Sources.vtkSphereSource.newInstance();
                sphere.setRadius(5);
                const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
                mapper.setInputConnection(sphere.getOutputPort());
                const actor = vtk.Rendering.Core.vtkActor.newInstance();
                actor.setMapper(mapper);
                actor.getProperty().setColor(...viewColors[i]);
                actor.setVisibility(showDebugActors);
                obj.sphereActors.push(actor);
                obj.sphereSources.push(sphere);
            }

            if (i<3){
                viewAttributes.push(obj);
            }else {
                view3D = obj;
            }

            const axes = vtk.Rendering.Core.vtkAnnotatedCubeActor.newInstance();
            axes.setDefaultStyle({
                text: '+X',
                fontStyle: 'bold',
                fontFamily: 'Arial',
                fontColor: 'white',
                fontSizeScale: (res) => res / 2,
                faceColor: createRGBStringFromRGBValues(viewColors[0]),
                faceRotation: 0,
                edgeThickness: 0.1,
                edgeColor: 'black',
                resolution: 400,
            });

            axes.setXMinusFaceProperty({
                text: '-X',
                faceColor: createRGBStringFromRGBValues(viewColors[0]),
                faceRotation: 90,
                fontStyle: 'italic',
            });

            axes.setYPlusFaceProperty({
                text: '+Y',
                faceColor: createRGBStringFromRGBValues(viewColors[1]),
                fontSizeScale: (res) => res / 4,
            });

            axes.setYMinusFaceProperty({
                text: '-Y',
                faceColor: createRGBStringFromRGBValues(viewColors[1]),
                fontColor: 'white',
            });

            axes.setZPlusFaceProperty({
                text: '+Z',
                faceColor: createRGBStringFromRGBValues(viewColors[2]),
            });

            axes.setZMinusFaceProperty({
                text: '-Z',
                faceColor: createRGBStringFromRGBValues(viewColors[2]),
                faceRotation: 45,
            });

            const orientationWidget = vtk.Interaction.Widgets.vtkOrientationMarkerWidget.newInstance({
                actor: axes,
                interactor: obj.renderWindow.getInteractor(),
            });
            orientationWidget.setEnabled(true);
            orientationWidget.setViewportCorner(
                vtk.Interaction.Widgets.vtkOrientationMarkerWidget.Corners.BOTTOM_RIGHT
            );
            orientationWidget.setViewportSize(0.1);
            orientationWidget.setMinPixelSize(100);
            orientationWidget.setMaxPixelSize(300);
        }



        function updateReslice(
            interactionContext={
                viewType: '',
                reslice: null,
                actor: null,
                renderer: null,
                resetFocalPoint: false,
                keepFocalPointPosition: false,
                computeFocalPointOffset: false,
                spheres: null,
            }
        ) {
            const obj = widget.updateReslicePlane(
                interactionContext.reslice,
                interactionContext.viewType
            );
            if (obj.modified){
                interactionContext.actor.setUserMatrix(
                    interactionContext.reslice.getResliceAxes()
                );
                interactionContext.sphereSources[0].setCenter(...obj.origin);
                interactionContext.sphereSources[1].setCenter(...obj.point1);
                interactionContext.sphereSources[2].setCenter(...obj.point2);
            }
            widget.updateCameraPoints(
                interactionContext.renderer,
                interactionContext.viewType,
                interactionContext.resetFocalPoint,
                interactionContext.keepFocalPointPosition,
                interactionContext.computeFocalPointOffset
            );
            view3D.renderWindow.render();
            return obj.modified;
        }



        Promise.all(fetchFiles).then((files)=>{
            itk.readImageDICOMFileSeries(files).then(({image}) => {
                const imageData1 = vtk.Common.DataModel.vtkITKHelper.convertItkToVtkImage(image);

                widget.setImage(imageData1);

                const outline = vtk.Filters.General.vtkOutlineFilter.newInstance();
                outline.setInputData(imageData1);
                const outlineMapper = vtk.Rendering.Core.vtkMapper.newInstance();
                outlineMapper.setInputData(outline.getOutputData());
                const outlineActor = vtk.Rendering.Core.vtkActor.newInstance();
                outlineActor.setMapper(outlineMapper);
                view3D.renderer.addActor(outlineActor);

                viewAttributes.forEach((obj,i)=>{
                    obj.reslice.setInputData(imageData1);
                    obj.renderer.addActor(obj.resliceActor);
                    view3D.renderer.addActor(obj.resliceActor);
                    obj.sphereActors.forEach((actor)=>{
                        obj.renderer.addActor(actor);
                        view3D.renderer.addActor(actor);
                    });
                    const reslice = obj.reslice;
                    const viewType = xyzToViewType[i];

                    viewAttributes.forEach((v)=>{

                        v.widgetInstance.onInteractionEvent(
                            ({ computeFocalPointOffset, canUpdateFocalPoint })=>{
                                const activeViewType = widget.getWidgetState().getActiveViewType();
                                const keepFocalPointPosition = activeViewType !== viewType && canUpdateFocalPoint;
                                updateReslice({
                                    viewType,
                                    reslice,
                                    actor: obj.resliceActor,
                                    renderer: obj.renderer,
                                    resetFocalPoint: false,
                                    keepFocalPointPosition,
                                    computeFocalPointOffset,
                                    sphereSources: obj.sphereSources,
                                });
                            }
                        );
                    });

                    updateReslice({
                        viewType,
                        reslice,
                        actor: obj.resliceActor,
                        renderer: obj.renderer,
                        resetFocalPoint: true,
                        keepFocalPointPosition: false,
                        computeFocalPointOffset: true,
                        sphereSources: obj.sphereSources,
                    });
                    obj.renderWindow.render();
                });


                view3D.renderer.resetCamera();
                view3D.renderer.resetCameraClippingRange();
                function length(a) {
                    let x = a[0];
                    let y = a[1];
                    let z = a[2];
                    return Math.hypot(x, y, z);
                }

                const maxNumberOfSlices = length(imageData1.getDimensions());
                document.getElementById('slabNumber').max = maxNumberOfSlices;

                function updateViews() {
                    viewAttributes.forEach((obj, i) => {
                        updateReslice({
                            viewType: xyzToViewType[i],
                            reslice: obj.reslice,
                            actor: obj.resliceActor,
                            renderer: obj.renderer,
                            resetFocalPoint: true,
                            keepFocalPointPosition: false,
                            computeFocalPointOffset: true,
                            sphereSources: obj.sphereSources,
                            resetViewUp: true,
                        });
                        obj.renderWindow.render();
                    });

                    view3D.renderer.resetCamera();
                    view3D.renderer.resetCameraClippingRange();
                }

                const checkboxOrthogonality = document.getElementById('checkboxOrthogality');
                checkboxOrthogonality.addEventListener('change', (ev) => {
                    widgetState.setKeepOrthogonality(checkboxOrthogonality.checked);
                });

                const checkboxRotation = document.getElementById('checkboxRotation');
                checkboxRotation.addEventListener('change', (ev) => {
                    widgetState.setEnableRotation(checkboxRotation.checked);
                });

                const checkboxTranslation = document.getElementById('checkboxTranslation');
                checkboxTranslation.addEventListener('change', (ev) => {
                    widgetState.setEnableTranslation(checkboxTranslation.checked);
                });

                const checkboxScaleInPixels = document.getElementById('checkboxScaleInPixels');
                checkboxScaleInPixels.addEventListener('change', (ev) => {
                    viewAttributes.forEach((obj) => {
                        obj.widgetInstance.setScaleInPixels(checkboxScaleInPixels.checked);
                        obj.interactor.render();
                    });
                });

                const optionSlabModeMin = document.getElementById('slabModeMin');
                optionSlabModeMin.value = vtk.Imaging.Core.vtkImageReslice.SlabMode.MIN;
                const optionSlabModeMax = document.getElementById('slabModeMax');
                optionSlabModeMax.value = vtk.Imaging.Core.vtkImageReslice.SlabMode.MAX;
                const optionSlabModeMean = document.getElementById('slabModeMean');
                optionSlabModeMean.value = vtk.Imaging.Core.vtkImageReslice.SlabMode.MEAN;
                const optionSlabModeSum = document.getElementById('slabModeSum');
                optionSlabModeSum.value = vtk.Imaging.Core.vtkImageReslice.SlabMode.SUM;
                const selectSlabMode = document.getElementById('slabMode');
                selectSlabMode.addEventListener('change', (ev) => {
                    viewAttributes.forEach((obj) => {
                        obj.reslice.setSlabMode(Number(ev.target.value));
                    });
                    updateViews();
                });

                const sliderSlabNumberofSlices = document.getElementById('slabNumber');
                sliderSlabNumberofSlices.addEventListener('change', (ev) => {
                    const trSlabNumberValue = document.getElementById('slabNumberValue');
                    trSlabNumberValue.innerHTML = ev.target.value;
                    viewAttributes.forEach((obj) => {
                        obj.reslice.setSlabNumberOfSlices(ev.target.value);
                    });
                    updateViews();
                });

                const buttonReset = document.getElementById('buttonReset');
                const buttonReset1 = document.getElementById('buttonReset1');
                buttonReset.addEventListener('click', () => {
                    widgetState.setPlanes({ ...initialPlanesState });
                    widget.setCenter(widget.getWidgetState().getImage().getCenter());
                    updateViews();
                });
                buttonReset1.addEventListener('click', () => {
                    widgetState.setPlanes({ ...initialPlanesState });
                    widget.setCenter(widget.getWidgetState().getImage().getCenter());
                    // const x = widgetState.state().getAxisXinX();
                    const y = widgetState.getPlanes();
                    // console.log('x'+x);
                    console.log('y'+y);


                    /** This method must be called when the focal point or camera position changes **/
                    //computeDistance();

                    // console.log('height'+height);
                    updateViews();
                });

            })
        })
    })
    .catch(function (error) {
        console.log(error);
    })

